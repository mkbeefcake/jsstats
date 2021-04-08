import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";
import proposalPosts from "./proposalPosts";
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
  Status,
} from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";
import { VoteKind } from "@joystream/types/proposals";

interface IProps {}

const version = 0.4;

const initialState = {
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
  proposalPosts,
  reports: {},
  stakes: {},
  stashes: [],
  stars: {},
  hideFooter: false,
  status: { connecting: true, loading: "" },
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
    let blockHash = await api.rpc.chain.getBlockHash(1);
    let startTime = (await api.query.timestamp.now.at(blockHash)).toNumber();
    let stage: any = await api.query.councilElection.stage();
    let termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());
    let round: number = Number(
      (await api.query.councilElection.round()).toJSON()
    );

    let status: Status = {
      block: { id: 0, era: 0, timestamp: 0, duration: 6 },
      council: { termEndsAt, stage: stage.toJSON(), round },
      category: await get.currentCategoryId(api),
      channel: await get.currentChannelId(api),
      post: await get.currentPostId(api),
      thread: await get.currentThreadId(api),
      member: await api.query.members.nextMemberId(),
      proposals: 0,
      startTime,
    };
    this.save("status", status);

    api.rpc.chain.subscribeNewHeads((header: Header) =>
      this.handleBlock(api, header)
    );
    //this.enqueue("members", () =>      this.fetchMembers(api, Number(status.member)) );
    //    this.enqueue("councils", () => this.fetchCouncils(api, round));
    //    this.enqueue("proposals", () => this.fetchProposals(api));
    //    this.enqueue("validators", () => this.fetchValidators(api));
    //    this.enqueue("nominators", () => this.fetchNominators(api));
    //    this.enqueue("categories", () => this.fetchCategories(api));
    //    this.enqueue("threads", () => this.fetchThreads(api, status.thread));
    //    this.enqueue("posts", () => this.fetchPosts(api, status.post));
    //this.enqueue("channels", () => this.fetchChannels(api, status.channel));
  }

  async handleBlock(api, header: Header) {
    let { blocks, status } = this.state;

    // current block
    const id = header.number.toNumber();
    if (blocks.find((b) => b.id === id)) return;
    const timestamp = (await api.query.timestamp.now()).toNumber();
    const duration = status.block ? timestamp - status.block.timestamp : 6000;
    status.block = { id, timestamp, duration };
    blocks = blocks.concat(status.block);
    this.setState({ blocks });

    // validators
    const era = Number(await api.query.staking.currentEra());
    this.fetchEraRewardPoints(api, era);
    if (era > status.era) {
      status.era = era;
      this.fetchStakes(api, era, this.state.validators);
      this.fetchLastReward(api, era - 1);
    } else if (!status.lastReward) this.fetchLastReward(api, era);

    if (id / 10 === Math.floor(id / 10)) {
      console.debug(`Updating cache`); // every minute (10 blocks)
      status.loading = "data";
      this.updateCouncil(api, id);
      status.proposals = await this.fetchProposals(api, status.proposals);
      status.posts = await this.fetchPosts(api, status.posts);
      status.channels = await this.fetchChannels(api, status.currentChannel);
      status.categories = await this.fetchCategories(api);
      status.threads = await this.fetchThreads(api, status.threads);
      status.proposalPosts = await api.query.proposalsDiscussion.postCount();
    }

    this.save("status", status);
    this.nextTask();
  }

  async updateCouncil(api, id) {
    let { status } = this.state;
    if (!status.council) return;
    if (id < status.council.termEndsAt || id < status.council.stageEndsAt)
      return;
    const round = Number((await api.query.councilElection.round()).toJSON());
    const stage = await api.query.councilElection.stage();
    const json = stage.toJSON();
    const key = Object.keys(json)[0];
    const stageEndsAt = json[key];
    const termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());
    status.council = { round, stageEndsAt, termEndsAt, stage: stage.toJSON() };
    this.save("status", status);
  }

  enqueue(key: string, action: () => void) {
    this.setState({ queue: this.state.queue.concat({ key, action }) });
  }
  async nextTask() {
    let { queue, status } = this.state;
    if (status.loading === "") return;
    const task = queue.shift();
    if (!task) return;
    status.loading = task.key;
    this.setState({ status, queue });
    console.debug(`processing: ${status.loading}`);

    await task.action();
    status.loading = "";
    this.setState({ status });
    setTimeout(() => this.nextTask(), 0);
  }

  async fetchLastReward(api: Api, era: number) {
    const lastReward = Number(await api.query.staking.erasValidatorReward(era));
    console.debug(`last reward`, era, lastReward);
    if (lastReward) {
      let { status } = this.state;
      status.lastReward = lastReward;
      this.save("status", status);
    } else this.fetchLastReward(api, era - 1);
  }

  async fetchTokenomics() {
    console.debug(`Updating tokenomics`);
    try {
      const { data } = await axios.get("https://status.joystream.org/status");
      if (!data) return;
      this.save("tokenomics", data);
    } catch (e) {}
  }

  async fetchChannels(api: Api) {
    const lastId = await get.currentChannelId(api);
    for (let id = lastId; id > 0; id--) {
      if (this.state.channels.find((c) => c.id === id)) return lastId;

      console.debug(`Fetching channel ${id}`);
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
      //this.fetchMemberByAccount(api, accountId);

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
    }
    return lastId;
  }

  async fetchCategories(api: Api) {
    const lastId = await get.currentCategoryId(api);
    for (let id = lastId; id > 0; id--) {
      if (this.state.categories.find((c) => c.id === id)) return lastId;
      this.enqueue(`category ${id}`, () => this.fetchCategory(api, id));
    }
    return lastId;
  }
  async fetchCategory(api: Api, id: number) {
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
  }
  async fetchPosts(api: Api) {
    const lastId = get.currentPostId(api);
    //const { data } = await axios.get(`${apiLocation}/posts`);
    //console.log(`received posts`, data);
    //this.save("posts", data);
    //return lastId;

    let { posts } = this.state;
    for (let id = lastId; id > 0; id--) {
      if (posts.find((p) => p.id === id)) return lastId;
      this.enqueue(`post ${id}`, () => this.fetchPost(api, id));
    }
    return lastId;
  }
  async fetchPost(api: Api, id: number) {
    if (this.state.posts.find((p) => p.id === id)) return;
    console.debug(`fetching post ${id}`);
    const data = await api.query.forum.postById(id);

    const threadId = Number(data.thread_id);
    const text = data.current_text.slice(0, 1000);
    //const moderation = data.moderation;
    //const history = data.text_change_history;
    const createdAt = data.created_at;
    const authorId = String(data.author_id);

    const post: Post = { id, threadId, text, authorId, createdAt };
    const posts = this.state.posts.concat(post);
    this.save("posts", posts);
  }

  async fetchThreads(api: Api) {
    const lastId = await get.currentThreadId(api);
    for (let id = lastId; id > 0; id--) {
      if (this.state.threads.find((t) => t.id === id)) return lastId;
      console.debug(`fetching thread ${id}`);
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
    }
    return lastId;
  }

  async fetchCouncils(api: Api, currentRound: number) {
    let { councils } = this.state;
    const cycle = 201600;

    for (let round = 0; round < currentRound; round++) {
      const block = 57601 + round * cycle;
      if (councils[round] || block > this.state.block) continue;

      console.debug(`Fetching council at block ${block}`);
      const blockHash = await api.rpc.chain.getBlockHash(block);
      if (!blockHash) continue;

      councils[round] = await api.query.council.activeCouncil.at(blockHash);
      this.save("councils", councils);
    }
  }

  // proposals
  async fetchProposals(api: Api) {
    const lastId = await get.proposalCount(api);
    for (let id = lastId; id > 0; id--)
      this.enqueue(`proposal ${id}`, () => this.fetchProposal(api, id));
    return lastId;
  }
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
    this.fetchVotesPerProposal(api, proposal);
  }

  async fetchVotesPerProposal(api: Api, proposal: ProposalDetail) {
    const { votesByAccount } = proposal;
    if (votesByAccount && votesByAccount.length) return;

    console.debug(`Fetching proposal votes (${proposal.id})`);
    const { councils, proposals } = this.state;
    let members: Member[] = [];
    councils.map((seats) =>
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
    console.debug(`Fetching vote by ${voterId} for proposal ${proposalId}`);
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

  // nominators, validators

  async fetchNominators(api: Api) {
    const nominatorEntries = await api.query.staking.nominators.entries();
    const nominators = nominatorEntries.map((n: any) => String(n[0].toHuman()));
    this.save("nominators", nominators);
  }
  async fetchValidators(api: Api) {
    // session.disabledValidators: Vec<u32>
    // TODO check online: imOnline.keys
    //  imOnline.authoredBlocks: 2
    // TODO session.currentIndex: 17,081
    const stashes = await api.derive.staking.stashes();
    this.save(
      "stashes",
      stashes.map((s: any) => String(s))
    );

    const validatorEntries = await api.query.session.validators();
    const validators = await validatorEntries.map((v: any) => String(v));
    this.save("validators", validators);
  }

  async fetchStakes(api: Api, era: number, validators: string[]) {
    // TODO staking.bondedEras: Vec<(EraIndex,SessionIndex)>
    console.debug(`fetching stakes`);
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
  async fetchMembers(api: Api, lastId: number) {
    for (let id = lastId; id > 0; id--) {
      this.fetchMember(api, id);
    }
  }
  async fetchMemberByAccount(api: Api, account: string): Promise<Member> {
    const exists = this.state.members.find(
      (m: Member) => String(m.account) === String(account)
    );
    if (exists) return exists;

    const id = await get.memberIdByAccount(api, account);
    if (!id)
      return { id: -1, handle: `unknown`, account, about: ``, registeredAt: 0 };
    return await this.fetchMember(api, Number(id));
  }
  async fetchMember(api: Api, id: number): Promise<Member> {
    const exists = this.state.members.find((m: Member) => m.id === id);
    if (exists) return exists;

    console.debug(`Fetching member ${id}`);
    const membership = await get.membership(api, id);

    const handle = String(membership.handle);
    const account = String(membership.root_account);
    const about = String(membership.about);
    const registeredAt = Number(membership.registered_at_block);
    const member: Member = { id, handle, account, registeredAt, about };
    const members = this.state.members.concat(member);
    this.save(`members`, members);
    this.updateHandles(members);
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
  loadCouncils() {
    const councils = this.load("councils");
    if (!councils || !councils.length || typeof councils[0][0] === "number")
      return;
    this.setState({ councils });
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
    let { status } = this.state;
    status.version = version;
    this.save("status", status);
    this.save("proposals", []);
    this.save("posts", []);
  }
  async loadData() {
    const status = this.load("status");
    if (status && status.version !== version) return this.clearData();
    if (status) this.setState({ status });
    console.debug(`Loading data`);
    this.loadMembers();
    this.loadCouncils();
    "categories channels proposals posts threads validators nominators handles tokenomics reports stakes stars"
      .split(" ")
      .map((key) => this.load(key));
    console.debug(`Finished loading.`);
  }

  load(key: string) {
    console.debug(`loading ${key}`);
    try {
      const data = localStorage.getItem(key);
      if (!data) return;
      const size = data.length;
      if (size > 10240) console.debug(`${key}: ${(size / 1024).toFixed(1)} KB`);
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
      if (key !== `posts`) {
        localStorage.setItem(`posts`, `[]`);
        localStorage.setItem(`channels`, `[]`);
      }
    }
  }

  toggleFooter() {
    console.log(this.state.hideFooter);
    this.setState({ hideFooter: !this.state.hideFooter });
  }

  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Routes
        toggleFooter={this.toggleFooter}
        toggleStar={this.toggleStar}
        {...this.state}
      />
    );
  }

  connectEndpoint() {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);
    ApiPromise.create({ provider, types }).then((api) =>
      api.isReady.then(() => {
        console.log(`Connected to ${wsLocation}`);
        this.setState({ connecting: false });
        this.handleApi(api);
      })
    );
  }

  componentDidMount() {
    this.loadData();
    this.connectEndpoint();
    //this.initializeSocket();
    this.fetchTokenomics();
    setInterval(this.fetchTokenomics, 900000);
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
