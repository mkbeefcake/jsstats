import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading, Footer, Status } from "./components";

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
  blocksPerCycle: 201600, // TODO calculate
  connected: false,
  fetching: "",
  queue: [],
  blocks: [],
  nominators: [],
  validators: [],
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
  reports: {},
  stakes: {},
  stashes: [],
  stars: {},
  hideFooter: false,
  status: { era: 0, block: { id: 0, era: 0, timestamp: 0, duration: 6 } },
};

class App extends React.Component<IProps, IState> {
  initializeSocket() {
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
    api.rpc.chain.subscribeNewHeads((header: Header) =>
      this.handleBlock(api, header)
    );
    this.updateStatus(api);

    let { status } = this.state;
    let blockHash = await api.rpc.chain.getBlockHash(1);
    status.startTime = (await api.query.timestamp.now.at(blockHash)).toNumber();
    this.save("status", status);
  }

  async handleBlock(api, header: Header) {
    let { blocks, status } = this.state;
    const id = header.number.toNumber();
    if (blocks.find((b) => b.id === id)) return;
    const timestamp = (await api.query.timestamp.now()).toNumber();
    const duration = status.block ? timestamp - status.block.timestamp : 6000;

    status.block = { id, timestamp, duration };
    this.save("status", status);

    blocks = blocks.concat(status.block);
    this.setState({ blocks });

    if (id / 50 === Math.floor(id / 50)) {
      this.updateStatus(api, id);
      this.fetchTokenomics();
    }
  }

  async updateStatus(api: Api, id = 0) {
    console.debug(`Updating status for block ${id}`);

    let { status } = this.state;
    status.era = await this.updateEra(api);
    status.council = await this.updateCouncil(api);
    await this.fetchCouncils(api);

    const nextMemberId = await await api.query.members.nextMemberId();
    status.members = nextMemberId - 1;
    status.proposals = await get.proposalCount(api);
    status.posts = await get.currentPostId(api);
    status.threads = await get.currentThreadId(api);
    status.categories = await get.currentCategoryId(api);
    status.channels = await get.currentChannelId(api);
    status.proposalPosts = await api.query.proposalsDiscussion.postCount();
    this.save("status", status);

    this.fetchProposal(api, status.proposals);
    this.fetchPost(api, status.posts);
    this.fetchThread(api, status.threads);
    this.fetchCategory(api, status.categories);
    this.fetchMember(api, status.members);
    this.fetchChannel(api, status.channels);
  }

  async updateEra(api: Api) {
    const era = Number(await api.query.staking.currentEra());
    this.fetchEraRewardPoints(api, era);

    const { status } = this.state;
    if (era > status.era) {
      console.debug(`Updating validators`);
      this.fetchLastReward(api, era - 1);
      const validators = await this.fetchValidators(api);
      this.enqueue("stakes", () => this.fetchStakes(api, era, validators));
    } else if (!status.lastReward) this.fetchLastReward(api, era - 1);
    return era;
  }

  // queue management
  enqueue(key: string, action: () => void) {
    this.setState({ queue: this.state.queue.concat({ key, action }) });
    this.processTask();
  }

  async processTask() {
    if (this.state.processingTask) return;
    let { queue } = this.state;
    const task = queue.shift();
    if (!task) return this.setState({ fetching: "" });
    this.setState({ fetching: task.key, queue, processingTask: true });
    //console.debug(`Fetching ${task.key}`);
    await task.action();
    this.setState({ processingTask: false });
    setTimeout(() => this.processTask(), 0);
  }

  async fetchLastReward(api: Api, era: number) {
    const lastReward = Number(await api.query.staking.erasValidatorReward(era));
    if (!lastReward) return this.fetchLastReward(api, era - 1);

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

    //console.debug(data, channel);
    const channels = this.state.channels.concat(channel);
    this.save("channels", channels);
    if (id > 1)
      this.enqueue(`channel ${id - 1}`, () => this.fetchChannel(api, id - 1));
  }

  async fetchCategory(api: Api, id: number) {
    if (this.state.categories.find((c) => c.id === id)) return;
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

    this.save("categories", this.state.categories.concat(category));
    if (id > 1)
      this.enqueue(`category ${id - 1}`, () => this.fetchCategory(api, id - 1));
  }
  async fetchPost(api: Api, id: number) {
    const exists = this.state.posts.find((p) => p.id === id);
    if (exists) return this.fetchMemberByAccount(api, exists.authorId);

    const data = await api.query.forum.postById(id);
    const threadId = Number(data.thread_id);
    const text = data.current_text.slice(0, 1000);
    //const moderation = data.moderation;
    //const history = data.text_change_history;
    const createdAt = data.created_at;
    const authorId = String(data.author_id);
    this.fetchMemberByAccount(api, authorId);

    const post: Post = { id, threadId, text, authorId, createdAt };
    const posts = this.state.posts.concat(post);
    this.save("posts", posts);
    if (id > 1)
      this.enqueue(`post ${id - 1}`, () => this.fetchPost(api, id - 1));
  }

  async fetchThread(api: Api, id: number) {
    if (this.state.threads.find((t) => t.id === id)) return;
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
    const threads = this.state.threads.concat(thread);
    this.save("threads", threads);
    if (id > 1)
      this.enqueue(`thread ${id - 1}`, () => this.fetchThread(api, id - 1));
  }

  // council
  async fetchCouncils(api: Api) {
    const currentRound = await api.query.councilElection.round();
    for (let round = Number(currentRound.toJSON()); round > 0; round--)
      this.enqueue(`council ${round}`, () => this.fetchCouncil(api, round));
  }

  async fetchCouncil(api: Api, round: number) {
    const council = await api.query.council.activeCouncil();
    let { councils } = this.state;
    councils[round] = council.toJSON();
    this.save("councils", councils);
    council.map((c) => this.fetchMemberByAccount(api, c.member));
  }

  async updateCouncil(api: Api, block: number) {
    const stage = await api.query.councilElection.stage();
    const json = stage.toJSON();
    const key = Object.keys(json)[0];
    const stageEndsAt = json[key];
    const termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());

    let { status } = this.state;
    const { council } = status;
    if (council)
      if (block < council.termEndsAt || block < council.stageEndsAt) return;

    const round = Number((await api.query.councilElection.round()).toJSON());
    status.council = { round, stageEndsAt, termEndsAt, stage: stage.toJSON() };
    this.save("status", status);
    this.fetchCouncil(api, round);
  }

  // proposals
  async fetchProposal(api: Api, id: number) {
    const { proposals } = this.state;
    const exists = this.state.proposals.find((p) => p && p.id === id);

    if (
      exists &&
      exists.detail &&
      exists.stage === "Finalized" &&
      exists.executed
    )
      if (exists.votesByAccount && exists.votesByAccount.length) return;
      else return this.fetchVotesPerProposal(api, exists);

    const proposal = await get.proposalDetail(api, id);
    if (proposal.type !== "Text") {
      const details = await api.query.proposalsCodex.proposalDetailsByProposalId(
        id
      );
      proposal.detail = details.toJSON();
    }
    proposals[id] = proposal;
    this.save("proposals", proposals);
    this.enqueue(`votes for proposal ${id}`, () =>
      this.fetchVotesPerProposal(api, proposal)
    );
    if (id > 1)
      this.enqueue(`proposal ${id - 1}`, () => this.fetchProposal(api, id - 1));
  }

  async fetchVotesPerProposal(api: Api, proposal: ProposalDetail) {
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
          member && members.push(member);
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

    const id = await get.memberIdByAccount(api, account);
    if (!id) return empty;
    return await this.fetchMember(api, Number(id));
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
    const members = this.state.members.concat(member);
    this.save(`members`, members);
    this.updateHandles(members);
    this.enqueue(`member ${id--}`, () => this.fetchMember(api, id--));
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
    if (status && status.version !== version) return this.clearData();
    if (status) this.setState({ status });
    console.debug(`Loading data`);
    this.loadMembers();
    "councils categories channels proposals posts threads handles tokenomics reports validators nominators stakes stars"
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

        <Footer
          show={!hideFooter}
          toggleHide={this.toggleFooter}
          link={userLink}
        />

        <Status connected={connected} fetching={fetching} />
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
  }
}

export default App;
