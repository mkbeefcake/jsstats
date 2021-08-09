import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modals, Routes, Loading, Footer, Status } from "./components";

import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";
import axios from "axios";

import { Api, IState } from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";

interface IProps {}

const version = 6;
const userLink = `${domain}/#/members/joystreamstats`;

const initialState = {
  assets: [],
  connected: false,
  fetching: "",
  tasks: 0,
  blocks: [],
  nominators: [],
  validators: [],
  mints: {},
  channels: [],
  posts: [],
  councils: [],
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
  status: { era: 0, block: { id: 0, era: 0, timestamp: 0, duration: 6 } },
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

  async handleApi(api: Api) {
    api.rpc.chain.subscribeNewHeads((head: Header) =>
      this.handleBlock(api, head)
    );
    this.fetchMints(api, [2, 3, 4]);
    this.updateStatus(api);
  }

  async fetchMints(api: Api, ids: number[]) {
    console.debug(`Fetching mints`);
    let mints = {};

    ids.map(
      async (id) => (mints[id] = (await api.query.minting.mints(id)).toJSON())
    );

    this.save(`mints`, mints);
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
    }
    if (!status.lastReward) this.fetchLastReward(api);
  }

  async updateStatus(api: Api, id = 0) {
    console.debug(`Updating status for block ${id}`);

    let { status, councils } = this.state;
    status.era = await this.updateEra(api);
    status.election = await this.updateElection(api);
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
    status.version = version;
    this.save("status", status);
  }

  async updateEra(api: Api) {
    const era = Number(await api.query.staking.currentEra());
    this.fetchEraRewardPoints(api, era);

    const { status } = this.state;
    if (era > status.era) {
      console.debug(`Updating validators`);
      this.fetchLastReward(api, status.era);
      const validators = await this.fetchValidators(api);
      this.fetchStakes(api, era, validators);
    } else if (!status.lastReward) this.fetchLastReward(api);
    return era;
  }

  async updateElection(api: Api) {
    console.debug(`Updating council`);
    const round = Number((await api.query.councilElection.round()).toJSON());
    const termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());
    const stage = (await api.query.councilElection.stage()).toJSON();
    let stageEndsAt = 0;
    if (stage) {
      const key = Object.keys(stage)[0];
      stageEndsAt = stage[key];
    }

    const stages = [
      "announcingPeriod",
      "votingPeriod",
      "revealingPeriod",
      "newTermDuration",
    ];

    let durations = await Promise.all(
      stages.map((s) => api.query.councilElection[s]())
    ).then((stages) => stages.map((stage) => stage.toJSON()));
    durations.push(durations.reduce((a, b) => a + b, 0));
    return { round, stageEndsAt, termEndsAt, stage, durations };
  }

  async fetchCouncils() {
    const { data } = await axios.get(
      `https://api.joystreamstats.live/api/v1/councils`
    );
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
    const { data } = await axios.get(
      `https://api.joystreamstats.live/api/v1/proposals`
    );
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`proposals`, data);
    this.save("proposals", data);
  }
  async fetchPosts() {
    const { data } = await axios.get(
      `https://api.joystreamstats.live/api/v1/posts`
    );
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`posts`, data);
    this.save("posts", data);
  }
  async fetchMembers() {
    const { data } = await axios.get(
      `https://api.joystreamstats.live/api/v1/members`
    );
    if (!data || data.error) return console.error(`failed to fetch from API`);
    console.debug(`members`, data);
    this.save("members", data);
  }

  addOrReplace(array, item) {
    return array.filter((i) => i.id !== item.id).concat(item);
  }

  async fetchLastReward(api: Api) {
    const era: number = await this.updateEra(api);
    const lastReward = Number(
      await api.query.staking.erasValidatorReward(era - 2)
    );

    console.debug(`reward era ${era}: ${lastReward} tJOY`);
    let { status } = this.state;
    status.lastReward = lastReward;
    this.save("status", status);
  }

  async fetchTokenomics() {
    console.debug(`Updating tokenomics`);
    const { data } = await axios.get(
      "https://joystreamstats.live/static/status.json"
    );
    //const { data } = await axios.get("https://status.joystream.org/status");
    if (!data || data.error) return;
    this.save("tokenomics", data);
  }

  // validators

  async fetchValidators(api: Api) {
    const validatorEntries = await api.query.session.validators();
    const validators = validatorEntries.map((v: any) => String(v));
    this.save("validators", validators);

    const stashes = await api.derive.staking.stashes();
    this.save(
      "stashes",
      stashes.map((s: any) => String(s))
    );
    this.fetchNominators(api);
    return validators;
  }

  async fetchNominators(api: Api) {
    const nominatorEntries = await api.query.staking.nominators.entries();
    const nominators = nominatorEntries.map((n: any) => String(n[0].toHuman()));
    this.save("nominators", nominators);
  }

  async fetchStakes(api: Api, era: number, validators: string[]) {
    // TODO staking.bondedEras: Vec<(EraIndex,SessionIndex)>
    const { stashes } = this.state;
    if (!stashes) return;
    stashes.forEach(async (validator: string) => {
      try {
        const prefs = await api.query.staking.erasValidatorPrefs(
          era,
          validator
        );
        const commission = Number(prefs.commission) / 10000000;

        const data = await api.query.staking.erasStakers(era, validator);
        let { total, own, others } = data.toJSON();
        let { stakes = {} } = this.state;

        stakes[validator] = { total, own, others, commission };
        this.save("stakes", stakes);
      } catch (e) {
        console.warn(
          `Failed to fetch stakes for ${validator} in era ${era}`,
          e
        );
      }
    });
  }

  async fetchEraRewardPoints(api: Api, era: number) {
    const data = await api.query.staking.erasRewardPoints(era);
    this.setState({ rewardPoints: data.toJSON() });
  }

  // Validators
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

  clearData() {
    console.log(`Resetting db to version ${version}`);
    localStorage.clear();
  }

  async loadData() {
    const status = this.load("status");
    if (status) {
      console.debug(`Status`, status, `Version`, version);
      if (status.version !== version) return this.clearData();
      this.setState({ status });
    }
    console.debug(`Loading data`);
    this.loadMembers();
    "assets providers councils categories channels proposals posts threads  mints tokenomics transactions reports validators nominators stakes stars"
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
          toggleFooter={this.toggleFooter}
          toggleStar={this.toggleStar}
          getMember={this.getMember}
          fetchProposals={this.fetchProposals}
          {...this.state}
        />

        <Modals toggleShowStatus={this.toggleShowStatus} {...this.state} />

        <Footer
          show={!hideFooter}
          toggleHide={this.toggleFooter}
          link={userLink}
        />

        <Status
          toggleShowStatus={this.toggleShowStatus}
          connected={connected}
          fetching={fetching}
        />
      </>
    );
  }

  connectEndpoint() {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);
    ApiPromise.create({ provider, types }).then((api) =>
      api.isReady.then(() => {
        console.log(`Connected to ${wsLocation}`);
        this.setState({ connected: true });
        this.handleApi(api);
      })
    );
  }

  componentDidMount() {
    this.loadData();
    this.connectEndpoint();
    this.fetchProposals();
    this.fetchPosts();
    this.fetchMembers();
    this.fetchCouncils();
    this.fetchStorageProviders();
    this.fetchAssets();
    setTimeout(() => this.fetchTokenomics(), 30000);
    //this.initializeSocket();
  }
  componentWillUnmount() {}
  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.fetchTokenomics = this.fetchTokenomics.bind(this);
    this.load = this.load.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
    this.toggleShowStatus = this.toggleShowStatus.bind(this);
    this.getMember = this.getMember.bind(this);
    this.fetchProposals = this.fetchProposals.bind(this);
  }
}

export default App;
