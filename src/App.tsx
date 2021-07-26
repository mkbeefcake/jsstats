import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modals, Routes, Loading, Footer, Status } from "./components";

import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";
//import proposalPosts from "./proposalPosts";
import axios from "axios";
import { ProposalDetail } from "./types";
//import socket from "./socket";

import {
  Api,
  Handles,
  IState,
  Member,
  Category,
  Channel,
  Post,
  Seat,
  Thread,
  //  Status,
} from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";
import { VoteKind } from "@joystream/types/proposals";

interface IProps {}

const version = 5;
const userLink = `${domain}/#/members/joystreamstats`;

const initialState = {
  assets: [],
  connected: false,
  fetching: "",
  tasks: 0,
  queue: [],
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
  handles: {},
  members: [],
  proposalPosts: [],
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

    let { status } = this.state;
    let blockHash = await api.rpc.chain.getBlockHash(1);
    status.startTime = (await api.query.timestamp.now.at(blockHash)).toNumber();
    this.save("status", status);
  }

  async fetchTransactions() {
    console.debug(`Fetching transactions`);
    const hydra = `https://joystream-sumer.indexer.gc.subsquid.io/graphql`;
    console.debug(`Fetching transactions`);
    const request = {
      query: `query{\n  substrateEvents(where: {section_eq: "balances", method_eq: "Transfer"}) {
   blockNumber
   section
   method
   data\n  }\n}`,
    };

    let transactions = await axios.post(hydra, request);

    this.save(`transactions`, transactions.data.data.substrateEvents);
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
    let { blocks, status, queue } = this.state;
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
    if (!queue.length) this.findJob(api);
  }

  async updateStatus(api: Api, id = 0) {
    console.debug(`Updating status for block ${id}`);

    let { status } = this.state;
    status.era = await this.updateEra(api);
    status.council = await this.updateCouncil(api);

    const nextMemberId = await await api.query.members.nextMemberId();
    status.members = nextMemberId - 1;
    status.proposals = await get.proposalCount(api);
    status.posts = await get.currentPostId(api);
    status.threads = await get.currentThreadId(api);
    status.categories = await get.currentCategoryId(api);
    //status.channels = await get.currentChannelId(api);
    status.proposalPosts = await api.query.proposalsDiscussion.postCount();
    await this.save("status", status);
    this.findJob(api);
  }

  async updateEra(api: Api) {
    const era = Number(await api.query.staking.currentEra());
    this.fetchEraRewardPoints(api, era);

    const { status } = this.state;
    if (era > status.era) {
      console.debug(`Updating validators`);
      this.fetchLastReward(api, status.era);
      const validators = await this.fetchValidators(api);
      this.enqueue("stakes", () => this.fetchStakes(api, era, validators));
    } else if (!status.lastReward) this.fetchLastReward(api);
    return era;
  }

  // queue management
  enqueue(key: string, action: () => void) {
    this.setState({ queue: this.state.queue.concat({ key, action }) });
    this.processTask();
  }

  findJob(api: Api) {
    const { status, proposals, posts, members } = this.state;
    if (!status.lastReward) this.fetchLastReward(api);
    if (
      status.council &&
      status.council.stageEndsAt > 0 &&
      status.council.stageEndsAt < status.block.id
    )
      this.updateCouncil(api);
    if (
      status.proposals > proposals.filter((p) => p && p.votesByAccount).length
    )
      this.fetchProposal(api, status.proposals);
    if (status.posts > posts.length) this.fetchPost(api, status.posts);
    if (status.members > members.length) this.fetchMember(api, status.members);
  }

  async processTask() {
    // check status
    let { tasks } = this.state;
    if (tasks > 1) return;
    if (tasks < 1) setTimeout(() => this.processTask(), 0);

    // pull task
    let { queue } = this.state;
    const task = queue.shift();
    if (!task) {
      if (!tasks) this.setState({ fetching: "" });
      return;
    }

    this.setState({ fetching: task.key, queue, tasks: tasks + 1 });
    await task.action();
    this.setState({ tasks: this.state.tasks - 1 });
    setTimeout(() => this.processTask(), 100);
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
    try {
      const { data } = await axios.get("https://status.joystream.org/status");
      if (!data) return;
      this.save("tokenomics", data);
    } catch (e) {}
  }

  async fetchChannel(api: Api, id: number) {
    if (this.state.channels.find((c) => c.id === id)) return;
    const data = await api.query.contentWorkingGroup.channelById(id);

    const handle = String(data.handle);
    const title = String(data.title);
    const description = String(data.description);
    const avatar = String(data.avatar);
    const banner = String(data.banner);
    const content = String(data.content);
    const ownerId = Number(data.owner);
    const accountId = String(data.role_account);
    const publicationStatus =
      data.publication_status === "Public" ? true : false;
    const curation = String(data.curation_status);
    const createdAt = data.created;
    const principal = Number(data.principal_id);
    this.fetchMemberByAccount(api, accountId);

    const channel: Channel = {
      id,
      handle,
      title,
      description,
      avatar,
      banner,
      content,
      ownerId,
      accountId,
      publicationStatus,
      curation,
      createdAt,
      principal,
    };

    const channels = this.addOrReplace(this.state.channels, channel);
    this.save("channels", channels);
    if (id > 1)
      this.enqueue(`channel ${id - 1}`, () => this.fetchChannel(api, id - 1));
  }

  async fetchCategory(api: Api, id: number) {
    if (!id) return;
    const exists = this.state.categories.find((c) => c.id === id);
    if (exists) return this.fetchCategory(api, id - 1);

    const data = await api.query.forum.categoryById(id);
    const threadId = Number(data.thread_id);
    const title = String(data.title);
    const description = String(data.description);
    const createdAt = Number(data.created_at.block);
    const deleted = data.deleted;
    const archived = data.archived;
    const subcategories = Number(data.num_direct_subcategories);
    const moderatedThreads = Number(data.num_direct_moderated_threads);
    const unmoderatedThreads = Number(data.num_direct_unmoderated_threads);
    const position = Number(data.position_in_parent_category);
    const moderatorId = String(data.moderator_id);

    const category: Category = {
      id,
      threadId,
      title,
      description,
      createdAt,
      deleted,
      archived,
      subcategories,
      moderatedThreads,
      unmoderatedThreads,
      position,
      moderatorId,
    };

    this.save("categories", this.addOrReplace(this.state.categories, category));
    this.enqueue(`category ${id - 1}`, () => this.fetchCategory(api, id - 1));
  }

  async fetchPost(api: Api, id: number) {
    if (!id) return;
    const exists = this.state.posts.find((p) => p.id === id);
    if (exists) return this.fetchPost(api, id - 1);

    const data = await api.query.forum.postById(id);
    const threadId = Number(data.thread_id);
    this.fetchThread(api, threadId);
    const text = data.current_text.slice(0, 1000);
    //const moderation = data.moderation;
    //const history = data.text_change_history;
    const createdAt = data.created_at;
    const authorId = String(data.author_id);
    this.fetchMemberByAccount(api, authorId);

    const post: Post = { id, threadId, text, authorId, createdAt };
    const posts = this.addOrReplace(this.state.posts, post);
    this.save("posts", posts);
    this.enqueue(`post ${id - 1}`, () => this.fetchPost(api, id - 1));
  }

  async fetchThread(api: Api, id: number) {
    if (!id) return;
    const exists = this.state.threads.find((t) => t.id === id);
    if (exists) return this.fetchThread(api, id - 1);

    const data = await api.query.forum.threadById(id);

    const title = String(data.title);
    const categoryId = Number(data.category_id);
    const nrInCategory = Number(data.nr_in_category);
    const moderation = data.moderation;
    const createdAt = String(data.created_at.block);
    const authorId = String(data.author_id);

    const thread: Thread = {
      id,
      title,
      categoryId,
      nrInCategory,
      moderation,
      createdAt,
      authorId,
    };
    const threads = this.addOrReplace(this.state.threads, thread);
    this.save("threads", threads);
    this.enqueue(`thread ${id - 1}`, () => this.fetchThread(api, id - 1));
  }

  // council
  async fetchCouncils(api: Api, currentRound: number) {
    for (let round = currentRound; round > 0; round--)
      this.enqueue(`council ${round}`, () => this.fetchCouncil(api, round));
  }

  async fetchCouncil(api: Api, round: number) {
    let { councils } = this.state;
    councils[round] = (await api.query.council.activeCouncil()).toJSON();
    councils[round].map((c) => this.fetchMemberByAccount(api, c.member));
    this.save("councils", councils);
  }

  async updateCouncil(api: Api, block: number) {
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
    this.fetchCouncils(api, round);
    return { round, stageEndsAt, termEndsAt, stage, durations };
  }

  // proposals
  async fetchProposal(api: Api, id: number) {
    if (id > 1)
      this.enqueue(`proposal ${id - 1}`, () => this.fetchProposal(api, id - 1));
    // find existing
    const { proposals } = this.state;
    const exists = this.state.proposals.find((p) => p && p.id === id);

    // check if complete
    if (
      exists &&
      exists.detail &&
      exists.stage === "Finalized" &&
      exists.executed
    )
      if (exists.votesByAccount && exists.votesByAccount.length) return;
      else
        return this.enqueue(`votes for proposal ${id}`, () =>
          this.fetchProposalVotes(api, exists)
        );

    // fetch
    const proposal = await get.proposalDetail(api, id);
    if (proposal.type !== "text")
      proposal.detail = (
        await api.query.proposalsCodex.proposalDetailsByProposalId(id)
      ).toJSON();
    proposals[id] = proposal;
    this.save("proposals", proposals);
    this.enqueue(`votes for proposal ${id}`, () =>
      this.fetchProposalVotes(api, proposal)
    );
  }

  async fetchProposalVotes(api: Api, proposal: ProposalDetail) {
    const { votesByAccount } = proposal;
    if (votesByAccount && votesByAccount.length) return;

    const { councils, proposals } = this.state;
    let members: Member[] = [];
    councils
      .filter((c) => c)
      .map((seats) =>
        seats.forEach(async (seat: Seat) => {
          if (members.find((member) => member.account === seat.member)) return;
          const member = this.state.members.find(
            (m) => m.account === seat.member
          );
          if (member) members.push(member);
        })
      );

    const { id } = proposal;
    proposal.votesByAccount = await Promise.all(
      members.map(async (member) => {
        const vote = await this.fetchVoteByProposalByVoter(api, id, member.id);
        return { vote, handle: member.handle };
      })
    );
    proposals[id] = proposal;
    this.save("proposals", proposals);
  }

  async fetchVoteByProposalByVoter(
    api: Api,
    proposalId: number,
    voterId: number
  ): Promise<string> {
    const vote: VoteKind = await api.query.proposalsEngine.voteExistsByProposalByVoter(
      proposalId,
      voterId
    );
    const hasVoted: number = (
      await api.query.proposalsEngine.voteExistsByProposalByVoter.size(
        proposalId,
        voterId
      )
    ).toNumber();

    return hasVoted ? String(vote) : "";
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
    this.enqueue("nominators", () => this.fetchNominators(api));
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

  // data objects
  fetchDataObjects() {
    // TODO dataDirectory.knownContentIds: Vec<ContentId>
  }

  // accounts
  async fetchMemberByAccount(api: Api, account: string): Promise<Member> {
    const empty = { id: -1, handle: `?`, account, about: ``, registeredAt: 0 };
    if (!account) return empty;
    const exists = this.state.members.find(
      (m: Member) => String(m.account) === String(account)
    );
    if (exists) return exists;

    const id = Number(await get.memberIdByAccount(api, account));
    if (!id) return empty;
    return await this.fetchMember(api, id);
  }
  async fetchMember(api: Api, id: number): Promise<Member> {
    const exists = this.state.members.find((m: Member) => m.id === id);
    if (exists) {
      setTimeout(() => this.fetchMember(api, id--), 0);
      return exists;
    }
    const membership = await get.membership(api, id);

    const handle = String(membership.handle);
    const account = String(membership.root_account);
    const about = String(membership.about);
    const registeredAt = Number(membership.registered_at_block);
    const member: Member = { id, handle, account, registeredAt, about };
    const members = this.addOrReplace(this.state.members, member);
    this.save(`members`, members);
    this.updateHandles(members);
    if (id > 1)
      this.enqueue(`member ${id - 1}`, () => this.fetchMember(api, id - 1));
    return member;
  }
  updateHandles(members: Member[]) {
    if (!members.length) return;
    let handles: Handles = {};
    members.forEach((m) => (handles[String(m.account)] = m.handle));
    this.save(`handles`, handles);
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

  loadMembers() {
    const members = this.load("members");
    if (!members) return;
    this.setState({ members });
    this.updateHandles(members);
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
    this.save("status", { version });
    this.save("proposals", []);
    this.save("posts", []);
  }

  async loadData() {
    const status = this.load("status");
    if (status)
      if (status.version !== version) return;
      // this.clearData();
      else this.setState({ status });
    console.debug(`Loading data`);
    this.loadMembers();
    "assets providers councils categories channels proposals posts threads handles mints tokenomics transactions reports validators nominators stakes stars"
      .split(" ")
      .map((key) => this.load(key));
  }

  load(key: string) {
    //console.debug(`loading ${key}`);
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
      //if (key !== `posts`) {
      //  localStorage.setItem(`posts`, `[]`);
      //  localStorage.setItem(`channels`, `[]`);
      //}
    }
  }

  toggleShowStatus() {
    this.setState({ showStatus: !this.state.showStatus });
  }
  toggleFooter() {
    this.setState({ hideFooter: !this.state.hideFooter });
  }

  render() {
    if (this.state.loading) return <Loading />;
    const { connected, fetching, hideFooter } = this.state;
    return (
      <>
        <Routes
          toggleFooter={this.toggleFooter}
          toggleStar={this.toggleStar}
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
    this.fetchStorageProviders();
    this.fetchAssets();
    this.fetchTransactions();
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
  }
}

export default App;
