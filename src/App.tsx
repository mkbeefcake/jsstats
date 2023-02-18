import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modals, Routes, Loading, Footer, Status } from "./components";

import * as get from "./lib/getters";
import { bootstrap, getTokenomics, queryJstats } from "./lib/queries";
import { getMints, updateOpenings, updateWorkers } from "./lib/groups";
import {
  updateElection,
  getCouncilApplicants,
  getCouncilSize,
  getVotes,
} from "./lib/election";
import {
  getStashes,
  getNominators,
  getValidators,
  getValidatorStakes,
  getEraRewardPoints,
  getLastReward,
  getTotalStake,
} from "./lib/validators";
import { apiLocation, wsLocation, historyDepth } from "./config";
import { initialState } from "./state";
import axios from "axios";

// types
import { Api, IState } from "./types";
// import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";

interface IProps {}

class App extends React.Component<IProps, IState> {
  // initializeSocket() {
  //   socket.on("disconnect", () => setTimeout(this.initializeSocket, 1000));
  //   socket.on("connect", () => {
  //     if (!socket.id) return console.log("no websocket connection");
  //     console.log("my socketId:", socket.id);
  //     socket.emit("get posts", this.state.posts.length);
  //   });
  //   socket.on("posts", (posts: Post[]) => {
  //     console.log(`received ${posts.length} posts`);
  //     this.setState({ posts });
  //   });
  // }

  // sync via joystream-api

  async updateStatus(api: ApiPromise, id: number): Promise<typeof Status> {
    console.debug(`#${id}: Updating status`);
    this.updateActiveProposals();
    getMints(api).then((mints) => this.save(`mints`, mints));
    getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));

    let { status, councils } = this.state;
    status.election = await updateElection(api);
    if (status.election?.stage) this.getElectionStatus(api);
    councils.forEach((c) => {
      if (c?.round > status.council) status.council = c;
    });

    let hash: string = await api.rpc.chain.getBlockHash(1);
    if (hash)
      status.startTime = (await api.query.timestamp.now.at(hash)).toNumber();

    const nextMemberId = await await api.query.members.nextMemberId();
    status.members = nextMemberId - 1;
    status.proposals = await get.proposalCount(api);
    status.posts = await get.currentPostId(api);
    status.threads = await get.currentThreadId(api);
    status.categories = await get.currentCategoryId(api);
    status.proposalPosts = await api.query.proposalsDiscussion.postCount();
    await this.updateEra(api, status.era).then(async (era) => {
      status.era = era;
      status.lastReward = await getLastReward(api, era);
      status.validatorStake = await getTotalStake(api, era);
      this.save("status", status);
    });
    return status;
  }

  async getElectionStatus(api: ApiPromise): Promise<IElectionState> {
    getCouncilSize(api).then((councilSize) => {
      let election = this.state.election;
      election.councilSize = councilSize;
      this.save("election", election);
    });
    getVotes(api).then((votes) => {
      let election = this.state.election;
      election.votes = votes;
      this.save("election", election);
    });
    getCouncilApplicants(api).then((applicants) => {
      let election = this.state.election;
      election.applicants = applicants;
      this.save("election", election);
    });
  }

  updateActiveProposals() {
    const active = this.state.proposals.filter((p) => p.result === "Pending");
    if (!active.length) return;
    const s = active.length > 1 ? `s` : ``;
    console.log(`Updating ${active.length} active proposal${s}`);
    active.forEach(async (a) => {
      const { data } = await axios.get(`${apiLocation}/v2/proposals/${a.id}`);
      if (!data || data.error)
        return console.error(`failed to fetch proposal from API`);
      this.save(
        "proposals",
        this.state.proposals.map((p) => (p.id === a.id ? data : p))
      );
    });
  }

  async updateEra(api: Api, old: number) {
    const { status, validators } = this.state;
    const era = Number(await api.query.staking.currentEra());
    if (era === old) return era;
    this.updateWorkingGroups(api);
    this.updateValidatorPoints(api, status.era);
    if (era > status.era || !validators.length) this.updateValidators(api);
    return era;
  }

  async updateWorkingGroups(api: ApiPromise) {
    const { members, openings, workers } = this.state;
    updateWorkers(api, workers, members).then((workers) => {
      this.save("workers", workers);
      updateOpenings(api, openings, members).then((openings) =>
        this.save("openings", openings)
      );
    });
    return this.save("council", await api.query.council.activeCouncil());
  }

  updateValidators(api: ApiPromise) {
    getValidators(api).then((validators) => {
      this.save("validators", validators);
      getNominators(api).then((nominators) => {
        this.save("nominators", nominators);
        getStashes(api).then((stashes) => {
          this.save("stashes", stashes);
          const { status, members } = this.state;
          const { era } = status;
          getValidatorStakes(api, era, stashes, members, this.save).then(
            (stakes) => this.save("stakes", stakes)
          );
        });
      });
    });
  }

  async updateValidatorPoints(api: ApiPromise, currentEra: number) {
    let points = this.state.rewardPoints;

    const updateTotal = (eraTotals) => {
      let total = 0;
      Object.keys(eraTotals).forEach((era) => (total += eraTotals[era]));
      return total;
    };

    for (let era = currentEra; era > currentEra - historyDepth; --era) {
      if (era < currentEra && points.eraTotals[era]) continue;
      getEraRewardPoints(api, era).then((eraPoints) => {
        console.debug(`era ${era}: ${eraPoints.total} points`);
        points.eraTotals[era] = eraPoints.total;
        points.total = updateTotal(points.eraTotals);
        Object.keys(eraPoints.individual).forEach((validator: string) => {
          if (!points.validators[validator]) points.validators[validator] = {};
          points.validators[validator][era] = eraPoints.individual[validator];
        });
        this.save("rewardPoints", points);
      });
    }
  }

  async updateCouncils() {
    queryJstats(`v1/councils`).then((councils) => {
      this.save(`councils`, councils);

      // TODO OPTIMIZE find max round
      let council = { round: 0 };
      councils.forEach((c) => {
        if (c.round > council.round) council = c;
      });
      let { status } = this.state;
      status.council = council; // needed by dashboard
      this.save("status", status);
    });
  }

  // interface interactions

  toggleStar(account: string) {
    let { stars } = this.state;
    stars[account] = !stars[account];
    this.save("stars", stars);
  }

  toggleEditKpi(editKpi) {
    this.setState({ editKpi });
  }
  toggleShowStatus() {
    this.setState({ showStatus: !this.state.showStatus });
  }
  toggleFooter() {
    this.setState({ hideFooter: !this.state.hideFooter });
  }

  getMember(handle: string) {
    const { members } = this.state;
    const member = members.find((m) => m.handle === handle);
    if (member) return member;
    return members.find((m) => m.rootKey === handle);
  }

  render() {
    const { connected, fetching, loading, hideFooter } = this.state;
    if (loading) return <Loading />;

    return (
      <>
        <Routes
          toggleEditKpi={this.toggleEditKpi}
          toggleFooter={this.toggleFooter}
          toggleStar={this.toggleStar}
          getMember={this.getMember}
          {...this.state}
        />

        <Modals
          toggleEditKpi={this.toggleEditKpi}
          toggleShowStatus={this.toggleShowStatus}
          {...this.state}
        />

        <Footer show={!hideFooter} toggleHide={this.toggleFooter} />

        <Status
          toggleShowStatus={this.toggleShowStatus}
          connected={connected}
          fetching={fetching}
        />
      </>
    );
  }

  // startup from bottom up

  joyApi() {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);
    ApiPromise.create({ provider/*, types*/ }).then(async (api) => {
      await api.isReady;
      console.log(`Connected to ${wsLocation}`);
      this.setState({ connected: true });
      this.updateWorkingGroups(api);

      api.rpc.chain.subscribeNewHeads(async (header: Header) => {
        let { blocks, status } = this.state;
        const id = header.number.toNumber();
        const isEven = id / 50 === Math.floor(id / 50);
        if (isEven || status.block?.id + 50 < id) this.updateStatus(api, id);

        if (blocks.find((b) => b.id === id)) return;
        const timestamp = (await api.query.timestamp.now()).toNumber();
        const duration = status.block
          ? timestamp - status.block.timestamp
          : 6000;
        status.block = { id, timestamp, duration };
        this.save("status", status);

        blocks = blocks.filter((i) => i.id !== id).concat(status.block);
        this.setState({ blocks });
      });
    });
  }

  save(key: string, data: any) {
    this.setState({ [key]: data });
    const value = JSON.stringify(data);
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      const size = value.length / 1024;
      console.warn(`Failed to save ${key} (${size.toFixed()} KB)`, e.message);
    }
    return data;
  }

  load(key: string) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return;
      const size = data.length;
      if (size > 10240)
        console.debug(` -${key}: ${(size / 1024).toFixed(1)} KB`);
      this.setState({ [key]: JSON.parse(data) });
      return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed to load ${key}`, e);
    }
  }

  async loadData() {
    console.debug(`Loading data`);
    "status members assets providers councils council election workers categories channels proposals posts threads mints openings tokenomics transactions reports validators nominators staches stakes rewardPoints stars"
      .split(" ")
      .map((key) => this.load(key));
    getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));
    bootstrap(this.save); // axios requests
    this.updateCouncils();
  }

  componentDidMount() {
    debugger;
    this.loadData(); // local storage + bootstrap
    // this.joyApi(); // joystream rpc connection
    //this.initializeSocket() // jsstats socket.io
  }

  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.toggleEditKpi = this.toggleEditKpi.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
    this.toggleShowStatus = this.toggleShowStatus.bind(this);
    this.getMember = this.getMember.bind(this);
  }
}

export default App;
