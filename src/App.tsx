import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modals, Routes, Loading, Footer, Status } from "./components";

import * as get from "./lib/getters";
import {
  updateElection,
  getCouncilApplicants,
  getCouncilSize,
  getVotes,
} from "./lib/election";
import {
  getValidators,
  getEraRewardPoints,
  getLastReward,
  getTotalStake,
} from "./lib/validators";
import { domain, apiLocation, wsLocation, historyDepth } from "./config";
import axios from "axios";
import moment from "moment";

import { Api, IState } from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";

interface IProps {}

const initialState = {
  assets: [],
  connected: false,
  faq: [],
  fetching: "",
  tasks: 0,
  blocks: [],
  nominators: [],
  validators: [],
  mints: [],
  channels: [],
  posts: [],
  councils: [],
  election: {
    applicants: [],
    votes: [],
    councilSize: 20,
  },
  categories: [],
  threads: [],
  proposals: [],
  domain,
  members: [],
  providers: [],
  reports: {},
  stakes: {},
  stashes: [],
  stars: {},
  hideFooter: true,
  showStatus: false,
  editKpi: false,
  status: { era: 0, block: { id: 0, era: 0, timestamp: 0, duration: 6 } },
  groups: [],
  rewardPoints: {
    total: 0,
    eraTotals: {},
    validators: {},
  },
};

class App extends React.Component<IProps, IState> {
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

  async handleApi(api: ApiPromise) {
    this.fetchFromApi();
    api.rpc.chain.subscribeNewHeads((head: Header) =>
      this.handleBlock(api, head)
    );
    this.updateStatus(api);
    this.fetchMints(api, [2, 3, 4]);
  }

  async fetchMints(api: Api, ids: number[]) {
    console.debug(`Fetching mints`);
    let mints = [];
    return Promise.all(
      ids.map(
        async (id) => (mints[id] = (await api.query.minting.mints(id)).toJSON())
      )
    ).then(() => this.save(`mints`, mints));
  }

  async fetchAssets() {
    const url = "https://hydra.joystream.org/graphql";
    const request = {
      query: "query {\n dataObjects(where: {}) { joystreamContentId }\n}",
    };
    console.debug(`Fetching data IDs (from ${url})`);
    const { data } = await axios.post(url, request);
    let assets = [];
    data.data.dataObjects.forEach((p) => assets.push(p.joystreamContentId));
    //console.log(`assets`, data);
    this.save(`assets`, assets);
  }

  async fetchStorageProviders() {
    const url = "https://hydra.joystream.org/graphql";
    const request = {
      query:
        'query {\n  workers(where: {metadata_contains: "http", isActive_eq: true, type_eq: STORAGE}){\n    metadata\n  }\n}',
    };
    console.debug(`Fetching storage providers (from ${url})`);
    const { data } = await axios.post(url, request);
    const providers = data.data.workers.map((p) => {
      return {
        url: p.metadata,
      };
    });
    this.save(`providers`, providers);
  }

  async getStorageProviders(api: Api) {
    console.debug(`Fetching storage providers (from chain)`);
    let providers = [];
    const worker = await api.query.storageWorkingGroup.nextWorkerId();
    console.log(`next provider: ${worker}`);

    for (let i = 0; i < Number(worker); ++i) {
      let storageProvider = (await api.query.storageWorkingGroup.workerById(
        i
      )) as WorkerOf;
      if (storageProvider.is_active) {
        const storage = (await api.query.storageWorkingGroup.workerStorage(
          i
        )) as Bytes;
        const url = Buffer.from(storage.toString().substr(2), "hex").toString();

        let membership = (await api.query.members.membershipById(
          storageProvider.member_id
        )) as Membership;

        providers[i] = {
          owner: membership.handle,
          account: membership.root_account,
          storage,
          url,
        };
      }
      this.save(`providers`, providers);
    }
  }

  async handleBlock(api, header: Header) {
    let { blocks, status } = this.state;
    const id = header.number.toNumber();
    if (blocks.find((b) => b.id === id)) return;
    const timestamp = (await api.query.timestamp.now()).toNumber();
    const duration = status.block ? timestamp - status.block.timestamp : 6000;

    status.block = { id, timestamp, duration };
    this.save("status", status);

    blocks = this.addOrReplace(blocks, status.block);
    this.setState({ blocks });

    if (id / 50 === Math.floor(id / 50)) {
      this.updateStatus(api, id);
      this.fetchTokenomics();
      this.updateActiveProposals();
    }
  }

  async updateStatus(api: ApiPromise, id = 0): Promise<Status> {
    console.debug(`Updating status for block ${id}`);
    let { status, councils } = this.state;
    status.era = await this.updateEra(api);
    status.election = await updateElection(api);
    if (
      status.election?.stage &&
      Object.keys(status.election.stage)[0] === "revealing"
    )
      this.getElectionStatus(api);
    councils.forEach((c) => {
      if (c.round > status.council) status.council = c;
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
    status.lastReward = await getLastReward(api, status.era);
    status.validatorStake = await getTotalStake(api, status.era);
    this.save("status", status);
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
      if (!data || data.error) return console.error(`failed to fetch from API`);
      this.save(
        "proposals",
        this.state.proposals.map((p) => (p.id === a.id ? data : p))
      );
    });
  }

  async updateEra(api: Api) {
    const { status, validators } = this.state;
    const era = Number(await api.query.staking.currentEra());
    this.updateWorkingGroups(api);
    this.updateValidatorPoints(api, status.era);
    if (era > status.era || !validators.length) this.updateValidators(api);
    return era;
  }

  async fetchCouncils() {
    const { data } = await axios.get(`${apiLocation}/v1/councils`);
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`councils`, data);
    this.save("councils", data);

    // TODO OPTIMIZE find max round
    let council = { round: 0 };
    data.forEach((c) => {
      if (c.round > council.round) council = c;
    });
    let { status } = this.state;
    status.council = council;
    this.save("status", status);
  }

  async fetchProposals() {
    const { data } = await axios.get(`${apiLocation}/v2/proposals`);
    if (!data || data.error) return console.error(`failed to fetch from API`);
    const proposals = data.filter((p) => p.created);
    console.debug(`proposals`, proposals);
    this.save("proposals", proposals);
  }

  async updateWorkingGroups(api: ApiPromise) {
    const openingsUpdated = this.state.openings?._lastUpdate;
    if (
      !openingsUpdated ||
      moment().valueOf() < moment(openingsUpdated).add(1, `hour`).valueOf()
    ) {
      const openings = {
        curators: await this.fetchOpenings(api, "contentDirectory"),
        storageProviders: await this.fetchOpenings(api, "storage"),
        operationsGroup: await this.fetchOpenings(api, "operations"),
        _lastUpdate: moment().valueOf(),
      };
      this.save("openings", openings);
    }

    const lastUpdate = this.state.workers?._lastUpdate;
    if (lastUpdate && moment() < moment(lastUpdate).add(1, `hour`)) return;
    const workers = {
      content: await this.fetchWorkers(api, "contentDirectory"),
      storage: await this.fetchWorkers(api, "storage"),
      operations: await this.fetchWorkers(api, "operations"),
      _lastUpdate: moment().valueOf(),
    };
    this.save("workers", workers);
    const council = await api.query.council.activeCouncil();
    this.save("council", council);
    return workers;
  }

  async fetchOpenings(api: ApiPromise, wg: string) {
    const group = wg + "WorkingGroup";
    const count = (
      (await api.query[group].nextOpeningId()) as OpeningId
    ).toNumber();
    console.debug(`Fetching ${count} ${wg} openings`);
    let openings = [];
    for (let wgOpeningId = 0; wgOpeningId < count; ++wgOpeningId) {
      const wgOpening: OpeningOf = (
        await api.query[group].openingById(wgOpeningId)
      ).toJSON();
      const openingId = wgOpening.hiring_opening_id;
      const opening = (await api.query.hiring.openingById(openingId)).toJSON();
      openings.push({
        ...opening,
        openingId,
        wgOpeningId,
        type: Object.keys(wgOpening.opening_type)[0],
        applications: await this.fetchApplications(
          api,
          group,
          wgOpening.applications
        ),
        policy: wgOpening.policy_commitment,
      });
    }
    console.debug(`${group} openings`, openings);
    return openings;
  }

  async fetchApplications(api: ApiPromise, group: string, ids: number[]) {
    const { members } = this.state;
    return Promise.all(
      ids.map(async (wgApplicationId) => {
        const wgApplication: ApplicationOf = (
          await api.query[group].applicationById(wgApplicationId)
        ).toJSON();
        let application = {};
        application.account = wgApplication.role_account_id;
        application.openingId = +wgApplication.opening_id;
        application.memberId = +wgApplication.member_id;
        const member = members.find((m) => +m.id === application.memberId);
        const handle = member ? member.handle : null;
        application.member = { handle };
        application.id = +wgApplication.application_id;
        application.application = (
          await api.query.hiring.applicationById(application.id)
        ).toJSON();
        return application;
      })
    );
  }

  async fetchWorkers(api: ApiPromise, wg: string) {
    const group = wg + "WorkingGroup";
    const { members } = this.state;
    let workers = [];
    const count = (
      (await api.query[group].nextWorkerId()) as WorkerId
    ).toNumber();
    const lead = await api.query[group].currentLead();
    console.debug(`Fetching ${count} ${wg} workers`);
    for (let id = 0; id < count; ++id) {
      const isLead = id === +lead;
      const worker: WorkerOf = await api.query[group].workerById(id);
      if (!worker.is_active) continue;
      const memberId = worker.member_id.toJSON();
      const member: Membership = members.find((m) => m.id === memberId);
      const handle = member?.handle;
      let stake: Stake;
      let reward: RewardRelationship;

      if (worker.role_stake_profile.isSome) {
        const roleStakeProfile = worker.role_stake_profile.unwrap();
        const stakeId = roleStakeProfile.stake_id;
        const { staking_status } = (
          await api.query.stake.stakes(stakeId)
        ).toJSON();
        stake = staking_status?.staked?.staked_amount;
      }

      if (worker.reward_relationship.isSome) {
        const rewardId = worker.reward_relationship.unwrap();
        reward = (
          await api.query.recurringRewards.rewardRelationships(rewardId)
        ).toJSON();
      }
      workers.push({
        id,
        memberId,
        handle,
        stake,
        reward,
        isLead,
      });
    }
    return workers;
  }

  // forum
  updateForum() {
    this.fetchPosts();
    this.fetchThreads();
    this.fetchCategories();
  }
  async fetchPosts() {
    const { data } = await axios.get(`${apiLocation}/v1/posts`);
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`posts`, data);
    this.save("posts", data);
  }

  async fetchThreads() {
    const { data } = await axios.get(`${apiLocation}/v1/threads`);
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`threads`, data);
    this.save("threads", data);
  }

  async fetchCategories() {
    const { data } = await axios.get(`${apiLocation}/v1/categories`);
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`categories`, data);
    this.save("categories", data);
  }

  async fetchMembers() {
    const { data } = await axios.get(`${apiLocation}/v1/members`);
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`members`, data);
    this.save("members", data);
  }

  async fetchFAQ() {
    const { data } = await axios.get(
      `https://joystreamstats.live/static/faq.json`
    );
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`faq`, data);
    this.save("faq", data);
  }

  addOrReplace(array, item) {
    return array.filter((i) => i.id !== item.id).concat(item);
  }

  async fetchTokenomics() {
    const now = new Date();
    if (this.state.tokenomics?.timestamp + 300000 > now) return;
    console.debug(`Updating tokenomics`);
    let { data } = await axios.get("https://status.joystream.org/status");
    if (!data || data.error) return;
    data.timestamp = now;
    this.save("tokenomics", data);
  }

  async updateValidators(api: ApiPromise) {
    this.save("validators", await getValidators(api));
    this.save("nominators", await getNominators(api));
    const stashes = await getStashes(api);
    this.save("stashes", stashes);
    const { members } = this.state;
    this.save("stakes", await getValidatorStakes(api, era, stashes, members));
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

  toggleStar(account: string) {
    let { stars } = this.state;
    stars[account] = !stars[account];
    this.save("stars", stars);
  }

  // Reports
  async fetchReports() {
    const domain = `https://raw.githubusercontent.com/Joystream/community-repo/master/council-reports`;
    const apiBase = `https://api.github.com/repos/joystream/community-repo/contents/council-reports`;

    const urls: { [key: string]: string } = {
      alexandria: `${apiBase}/alexandria-testnet`,
      archive: `${apiBase}/archived-reports`,
      template: `${domain}/templates/council_report_template_v1.md`,
    };

    ["alexandria", "archive"].map((folder) =>
      this.fetchGithubDir(urls[folder])
    );

    // template
    this.fetchGithubFile(urls.template);
  }

  async saveReport(name: string, content: Promise<string>) {
    const { reports } = this.state;
    reports[name] = await content;
    this.save("reports", reports);
  }

  async fetchGithubFile(url: string): Promise<string> {
    const { data } = await axios.get(url);
    return data;
  }
  async fetchGithubDir(url: string) {
    const { data } = await axios.get(url);

    data.forEach(
      async (o: {
        name: string;
        type: string;
        url: string;
        download_url: string;
      }) => {
        const match = o.name.match(/^(.+)\.md$/);
        const name = match ? match[1] : o.name;
        if (o.type === "file")
          this.saveReport(name, this.fetchGithubFile(o.download_url));
        else this.fetchGithubDir(o.url);
      }
    );
  }

  getMember(handle: string) {
    const { members } = this.state;
    const member = members.find((m) => m.handle === handle);
    if (member) return member;
    return members.find((m) => m.rootKey === handle);
  }

  loadMembers() {
    const members = this.load("members");
    if (!members) return;
    this.setState({ members });
  }

  loadPosts() {
    const posts: Post[] = this.load("posts");
    posts.forEach(({ id, text }) => {
      if (text && text.length > 500)
        console.debug(`post ${id}: ${(text.length / 1000).toFixed(1)} KB`);
    });
    if (posts) this.setState({ posts });
  }

  async loadData() {
    console.debug(`Loading data`);
    "status members assets providers councils council election workers categories channels proposals posts threads  mints openings tokenomics transactions reports validators nominators staches stakes rewardPoints stars"
      .split(" ")
      .map((key) => this.load(key));
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
  save(key: string, data: any) {
    this.setState({ [key]: data });
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Failed to save ${key} (${data.length}KB)`, e);
    }
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
          fetchProposals={this.fetchProposals}
          updateForum={this.updateForum}
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

  joyApi() {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);
    ApiPromise.create({ provider, types }).then(async (api) => {
      await api.isReady;
      console.log(`Connected to ${wsLocation}`);
      this.setState({ connected: true });
      this.handleApi(api);
    });
  }

  async fetchFromApi() {
    this.fetchProposals();
    this.updateForum();
    this.fetchMembers();
    this.fetchCouncils();
    this.fetchStorageProviders();
    this.fetchAssets();
    //this.fetchFAQ();
  }

  componentDidMount() {
    this.joyApi();
    this.loadData();
    setTimeout(() => this.fetchTokenomics(), 30000);
    //this.initializeSocket();
  }
  componentWillUnmount() {}
  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.fetchTokenomics = this.fetchTokenomics.bind(this);
    this.load = this.load.bind(this);
    this.toggleEditKpi = this.toggleEditKpi.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
    this.toggleShowStatus = this.toggleShowStatus.bind(this);
    this.getMember = this.getMember.bind(this);
    this.fetchProposals = this.fetchProposals.bind(this);
    this.updateForum = this.updateForum.bind(this);
  }
}

export default App;
