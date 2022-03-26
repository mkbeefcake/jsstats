import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modals, Routes, Loading, Footer, Status } from "./components";

import * as get from "./lib/getters";
import { getTokenomics, queryJstats } from "./lib/queries";
import { getCouncilApplicants, getCouncilSize, getVotes } from "./lib/election";
import {
  getStashes,
  getNominators,
  getValidators,
  getValidatorStakes,
  getEraRewardPoints,
  getLastReward,
  getTotalStake,
} from "./lib/validators";
import { getBlockHash, getEvents, getTimestamp } from "./jslib";
import { apiLocation, wsLocation, historyDepth } from "./config";
import { initialState } from "./state";
import axios from "axios";

// types
import { Api, IState } from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";

interface IProps {}

class App extends React.Component<IProps, IState> {
  private api = this.connectApi(); // joystream API endpoint
  //private socket = this.initializeSocket(); // jsstats socket.io

  initializeSocket() {
    socket.on("disconnect", () => setTimeout(this.initializeSocket, 1000));
    socket.on("connect", () => {
      if (!socket.id) return console.log("no websocket connection");
      console.log("my socketId:", socket.id);
      socket.emit("get posts", this.state.posts.length);
    });
    socket.on("posts", (posts: Post[]) => {
      console.log(`received ${posts.length} posts`);
      this.setState({ posts });
    });
  }

  // sync via joystream-api

  async updateStatus(api: ApiPromise, id: number): Promise<Status> {
    console.debug(`#${id}: Updating status`);
    //this.updateActiveProposals();
    //getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));

    let { status, councils } = this.state;
    //status.election = await updateElection(api);
    //if (status.election?.stage) this.getElectionStatus(api);
    councils.forEach((c) => {
      if (c?.round > status.council) status.council = c;
    });

    let hash: string = await getBlockHash(api, 1);
    if (hash) status.startTime = await getTimestamp(api, hash);

    const nextMemberId = await await api.query.members.nextMemberId();
    status.members = nextMemberId - 1;
    this.fetchMembers(api, status.members);
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

  fetchMembers(api: ApiPromise, max: number) {
    // fallback for failing cache
    let missing = [];
    for (let id = max; id > 0; --id) {
      if (!this.state.members.find((m) => m.id === id)) missing.push(id);
    }
    if (missing.length < 100)
      missing.forEach((id) => this.fetchMember(api, id));
    else
      api.query.members.membershipById.entries().then((map) => {
        let members = [];
        for (const [storageKey, member] of map) {
          members.push({ ...member.toJSON(), id: storageKey.args[1] });
        }
        this.save("members", members);
        console.debug(`got members`, members);
      });
  }

  fetchMember(api: ApiPromise, id: number) {
    get.membership(api, id).then((member) => {
      console.debug(`got member ${id} ${member.handle}`);
      const members = this.state.members.filter((m) => m.id !== id);
      this.save("members", members.concat({ ...member, id }));
    });
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
    this.updateValidatorPoints(api, status.era);
    if (era > status.era || !validators.length) this.updateValidators(api);
    return era;
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
      if (!councils) return;
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

  getMember(input: string) {
    const { members } = this.state;
    let member;
    // search by handle
    member = members.find((m) => m.handle === input);
    if (member) return member;

    // search by key
    member = members.find((m) => m.rootKey === input);
    if (member) return member;

    // TODO fetch live
    //member = await get.membership(this.api, input)
    //member = await get.memberIdByAccount(this.api, input)
    return {};
  }

  render() {
    const { connected, fetching, loading, hideFooter } = this.state;
    if (loading) return <Loading />;

    return (
      <>
        <Routes
          selectEvent={this.selectEvent}
          toggleEditKpi={this.toggleEditKpi}
          toggleFooter={this.toggleFooter}
          toggleStar={this.toggleStar}
          getMember={this.getMember}
          save={this.save}
          hidden={this.state.hidden}
          {...this.state}
        />

        <Modals
          selectEvent={this.selectEvent}
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
  selectEvent(selectedEvent) {
    this.setState({ selectedEvent });
  }

  async handleBlock(api: ApiPromise, header: Header) {
    let { status } = this.state;
    const id = header.number.toNumber();

    //const isEven = id / 50 === Math.floor(id / 50);
    //if (isEven || status.block?.id + 50 < id) this.updateStatus(api, id);
    if (this.state.blocks.find((b) => b.id === id)) return;

    const timestamp = (await api.query.timestamp.now()).toNumber();
    //const duration = status.block ? timestamp - status.block.timestamp : 6000;
    const hash = await getBlockHash(api, id);
    const events = (await getEvents(api, hash)).map((e) => {
      const { section, method, data } = e.event;
      return { blockId: id, section, method, data: data.toHuman() };
    });
    status.block = { id, timestamp, events };
    console.info(`new finalized head`, status.block);
    this.save("status", status);
    this.save("blocks", this.state.blocks.concat(status.block));
  }

  connectApi() {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);
    return ApiPromise.create({ provider, types }).then(async (api) => {
      await api.isReady;

      const [chain, nodeName, nodeVersion, runtimeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version(),
        api.runtimeVersion,
      ]);
      console.log(
        `Connected to ${wsLocation}: ${chain} spec:${runtimeVersion.specVersion} (${nodeName} v${nodeVersion})`
      );
      this.setState({ connected: true });
      api.rpc.chain.subscribeFinalizedHeads((header: Header) =>
        this.handleBlock(api, header)
      );
      this.syncBlocks(api)
    });
  }

  async syncBlocks(api:ApiPromise) {
    const head = this.state.blocks.reduce((max, b) => b.id > max ? b.id : max, 0)
    console.log(`Syncing block events from ${head}`)
    let missing = []
    for (let id = head ; id > 0 ; --id) {
      if (!this.state.blocks.find(block=> block.id === id)) missing.push(id)
    }
    if (!this.state.syncEvents) return
    const maxWorkers = 5
    let slots = []
    for (let s = 0 ; s < maxWorkers ; ++s) { slots[s] = s }
    slots.map(async (slot) =>{
      while (this.state.syncEventsl && missing.length) {
        const id = slot < maxWorkers /2 ? missing.pop() : missing.shift()
        await this.syncBlock(api, id, slot)
      }
      console.debug(`Slot ${slot} idle.`)
      return true
    })
  }

  async syncBlock(api:ApiPromise, id: number, slot: number) {
     try {
      const hash = await getBlockHash(api, id);
      const events = (await getEvents(api, hash)).map((e) => {
        const { section, method, data } = e.event;
        return { blockId: id, section, method, data: data.toHuman() };
      }).filter(e=> e.method !== 'ExtrinsicSuccess')
      const timestamp = (await api.query.timestamp.now.at(hash)).toNumber();
      //const duration = 6000 // TODO update later
      const block = { id, timestamp, events };
      console.debug(`worker ${slot}: synced block`, block);
      this.save("blocks", this.state.blocks.concat(block));
     } catch (e) {
      console.error(`Failed to get block ${id}: ${e.message}`)
     }
  }

  save(key: string, data: any) {
    this.setState({ [key]: data });
    const value = JSON.stringify(data);
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      const size = value.length / 1024;
      console.warn(`Failed to save ${key} (${size.toFixed()} KB)`, e.message);
      if (key === 'blocks') this.load(key)
      else this.setState({syncEvents:false})
    }
    return data;
  }

  load(key: string) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return console.debug(`loaded empty`, key);
      const size = data.length;
      if (size > 10240)
        console.debug(` -${key}: ${(size / 1024).toFixed(1)} KB`);
	let loaded = JSON.parse(data)
	if (key === 'blocks') loaded = loaded.map(({id,timestamp,events}) => {
         return {id,timestamp,events: events.filter(e=> e.method !== 'ExtrinsicSuccess')}
	})
      this.setState({ [key]: loaded  });
    } catch (e) {
      console.warn(`Failed to load ${key}`, e);
    }
  }

  async loadData() {
    console.debug(`Loading data`);
    "status members assets providers councils council election workers categories channels proposals posts threads openings tokenomics transactions reports validators nominators staches stakes rewardPoints stars blocks hidden"
      .split(" ")
      .map((key) => this.load(key));
    getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));
    //bootstrap(this.save); // axios requests
    //this.updateCouncils();
  }

  componentDidMount() {
    this.loadData(); // local storage + bootstrap
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
    this.selectEvent = this.selectEvent.bind(this);
  }
}

export default App;
