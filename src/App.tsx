import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";
import proposalPosts from "./proposalPosts";
import axios from "axios";
//import moment from "moment";

// types
import {
  Api,
  Block,
  Handles,
  IState,
  Member,
  Category,
  Channel,
  Post,
  Thread,
} from "./types";
import { types } from "@joystream/types";
import { Seat } from "@joystream/types/augment/all/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { AccountId, Header } from "@polkadot/types/interfaces";
import { MemberId } from "@joystream/types/members";
import { VoteKind } from "@joystream/types/proposals";

interface IProps {}

const version = 0.2;

const initialState = {
  blocks: [],
  now: 0,
  block: 0,
  termEndsAt: 0,
  loading: true,
  nominators: [],
  validators: [],
  channels: [],
  posts: [],
  councils: [],
  categories: [],
  threads: [],
  proposals: [],
  proposalCount: 0,
  domain,
  handles: {},
  members: [],
  proposalPosts,
  reports: {},
};

class App extends React.Component<IProps, IState> {
  async initializeSocket() {
    const provider = new WsProvider(wsLocation);
    const api = await ApiPromise.create({ provider, types });
    await api.isReady;
    console.log(`Connected to ${wsLocation}`);

    let blocks: Block[] = [];
    let lastBlock: Block = { id: 0, timestamp: 0, duration: 6 };

    let termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());
    let round: number = Number(
      (await api.query.councilElection.round()).toJSON()
    );
    let stage: any = await api.query.councilElection.stage();
    let councilElection = { termEndsAt, stage: stage.toJSON(), round };
    this.setState({ councilElection });
    let stageEndsAt: number = termEndsAt;

    let lastCategory = await get.currentCategoryId(api);
    this.fetchCategories(api, lastCategory);

    let lastChannel = await get.currentChannelId(api);
    this.fetchChannels(api, lastChannel);

    let lastPost = await get.currentPostId(api);
    this.fetchPosts(api, lastPost);

    let lastThread = await get.currentThreadId(api);
    this.fetchThreads(api, lastThread);

    api.rpc.chain.subscribeNewHeads(
      async (header: Header): Promise<void> => {
        // current block
        const id = header.number.toNumber();
        if (blocks.find((b) => b.id === id)) return;
        const timestamp = (await api.query.timestamp.now()).toNumber();
        const duration = timestamp - lastBlock.timestamp;
        const block: Block = { id, timestamp, duration };
        blocks = blocks.concat(block);
        this.setState({ now: timestamp, blocks, block: id, loading: false });

        const proposalCount = await get.proposalCount(api);
        if (proposalCount > this.state.proposalCount) {
          this.fetchProposal(api, proposalCount);
          this.setState({ proposalCount });
        }

        const currentChannel = await get.currentChannelId(api);
        if (currentChannel > lastChannel)
          lastChannel = await this.fetchChannels(api, currentChannel);

        const currentCategory = await get.currentCategoryId(api);
        if (currentCategory > lastCategory)
          lastCategory = await this.fetchCategories(api, currentCategory);

        const currentPost = await get.currentPostId(api);
        if (currentPost > lastPost)
          lastPost = await this.fetchPosts(api, currentPost);

        const currentThread = await get.currentThreadId(api);
        if (currentThread > lastThread)
          lastThread = await this.fetchThreads(api, currentThread);

        const postCount = await api.query.proposalsDiscussion.postCount();
        this.setState({ proposalComments: Number(postCount) });

        lastBlock = block;

        // check election stage
        if (id < termEndsAt || id < stageEndsAt) return;
        const json = stage.toJSON();
        const key = Object.keys(json)[0];
        stageEndsAt = json[key];
        //console.log(id, stageEndsAt, json, key);

        termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());
        round = Number((await api.query.councilElection.round()).toJSON());
        stage = await api.query.councilElection.stage();
        councilElection = { termEndsAt, stage: stage.toJSON(), round };
        this.setState({ councilElection });
      }
    );

    this.fetchCouncils(api, round);
    this.fetchProposals(api);
    this.fetchValidators(api);
    this.fetchNominators(api);
  }

  async fetchTokenomics() {
    console.log(`Updating tokenomics`);
    const { data } = await axios.get("https://status.joystream.org/status");
    if (!data) return;
    this.save("tokenomics", data);
  }

  async fetchChannels(api: Api, lastId: number) {
    for (let id = lastId; id > 0; id--) {
      if (this.state.channels.find((c) => c.id === id)) continue;
      console.log(`fetching channel ${id}`);
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
  async fetchCategories(api: Api, lastId: number) {
    for (let id = lastId; id > 0; id--) {
      if (this.state.categories.find((c) => c.id === id)) continue;
      console.debug(`fetching category ${id}`);
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

      //console.debug(data, category);
      const categories = this.state.categories.concat(category);
      this.save("categories", categories);
    }
    return lastId;
  }
  async fetchPosts(api: Api, lastId: number) {
    for (let id = lastId; id > 0; id--) {
      if (this.state.posts.find((p) => p.id === id)) continue;
      console.debug(`fetching post ${id}`);
      const data = await api.query.forum.postById(id);

      const threadId = Number(data.thread_id);
      const text = data.current_text;
      //const moderation = data.moderation;
      //const history = data.text_change_history;
      //const createdAt = moment(data.created_at);
      const createdAt = data.created_at;
      const authorId = String(data.author_id);

      const post: Post = { id, threadId, text, authorId, createdAt };

      //console.debug(data, post);
      const posts = this.state.posts.concat(post);
      this.save("posts", posts);
    }
    return lastId;
  }
  async fetchThreads(api: Api, lastId: number) {
    for (let id = lastId; id > 0; id--) {
      if (this.state.threads.find((t) => t.id === id)) continue;
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

      //console.debug(data, thread);
      const threads = this.state.threads.concat(thread);
      this.save("threads", threads);
    }
    return lastId;
  }

  async fetchCouncils(api: Api, currentRound: number) {
    if (this.state.councils.length)
      return this.state.councils.map((council) =>
        council.map((seat) => this.fetchMember(api, seat))
      );

    let councils: number[][] = [];
    const cycle = 201600;

    for (let round = 0; round < currentRound; round++) {
      let council: number[] = [];
      const block = 57601 + round * cycle;
      console.log(`fetching council at block ${block}`);

      const blockHash = await api.rpc.chain.getBlockHash(block);
      if (!blockHash) continue;
      const seats: Seat[] = await api.query.council.activeCouncil.at(blockHash);

      seats.forEach(async (seat) => {
        const member = await this.fetchMemberByAccount(api, seat.member);
        council = council.concat(Number(member.id));
        councils[round] = council;
        this.save("councils", councils);
      });
    }
  }

  // proposals
  async fetchProposals(api: Api) {
    const proposalCount = await get.proposalCount(api);
    for (let i = proposalCount; i > 0; i--) this.fetchProposal(api, i);
  }
  async fetchProposal(api: Api, id: number) {
    let { proposals } = this.state;
    const exists = proposals.find((p) => p && p.id === id);

    if (exists && exists.votesByMemberId && exists.stage === "Finalized")
      return;
    const proposal = await get.proposalDetail(api, id);
    if (!proposal) return;
    proposals[id] = proposal;
    this.save("proposals", proposals);
    this.fetchVotesPerProposal(api, id);
  }

  async fetchVotesPerProposal(api: Api, proposalId: number) {
    const { councils, proposals } = this.state;
    const proposal = proposals.find((p) => p && p.id === proposalId);
    if (!proposal) return;

    let memberIds: { [key: string]: number } = {};
    councils.map((ids: number[]) =>
      ids.map((memberId: number) => memberIds[`${memberId}`]++)
    );

    const { id } = proposal;
    proposal.votesByMemberId = await Promise.all(
      Object.keys(memberIds).map(async (key: string) => {
        const memberId = parseInt(key);
        const vote = await this.fetchVoteByProposalByVoter(api, id, memberId);
        return { vote, memberId };
      })
    );
    proposals[id] = proposal;
    this.save("proposals", proposals);
  }

  async fetchVoteByProposalByVoter(
    api: Api,
    proposalId: number,
    voterId: MemberId | number
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

    //const vote = await api.query.proposalsEngine.voteExistsByProposalByVoter(
    //  proposalId,
    //  memberId
    //);
    //return String(vote.toHuman());
  }

  // nominators, validators

  async fetchNominators(api: Api) {
    const nominatorEntries = await api.query.staking.nominators.entries();
    const nominators = nominatorEntries.map((n: any) => {
      const name = n[0].toHuman();
      this.fetchMemberByAccount(api, name);
      return `${name}`;
    });
    this.save("nominators", nominators);
  }
  async fetchValidators(api: Api) {
    const validatorEntries = await api.query.session.validators();
    const validators = await validatorEntries.map((v: any) => {
      this.fetchMemberByAccount(api, v.toJSON());
      return String(v);
    });
    this.save("validators", validators);
  }

  // accounts
  getHandle(account: AccountId | string): string {
    const member = this.state.members.find(
      (m) => String(m.account) === String(account)
    );
    return member ? member.handle : String(account);
  }
  async fetchMemberByAccount(
    api: Api,
    account: AccountId | string
  ): Promise<Member> {
    const exists = this.state.members.find(
      (m: Member) => String(m.account) === String(account)
    );
    if (exists) return exists;

    const id = await get.memberIdByAccount(api, account);
    if (!id) return { id: -1, handle: `unknown`, account };
    return await this.fetchMember(api, id);
  }
  async fetchMember(api: Api, id: MemberId | number): Promise<Member> {
    const exists = this.state.members.find((m: Member) => m.id === id);
    if (exists) return exists;

    const membership = await get.membership(api, id);

    const handle = String(membership.handle);
    const account = String(membership.root_account);
    const member: Member = { id, handle, account };
    const members = this.state.members.concat(member);

    if (members.length) this.save(`members`, members);
    this.updateHandles(members);
    return member;
  }
  updateHandles(members: Member[]) {
    if (!members.length) return;
    let handles: Handles = {};
    members.forEach((m) => (handles[String(m.account)] = m.handle));
    this.save(`handles`, handles);
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
    this.updateHandles(members);
    this.setState({ members });
  }
  loadCouncils() {
    const councils = this.load("councils");
    if (councils) this.setState({ councils });
  }
  loadProposals() {
    const proposals = this.load("proposals");
    if (proposals) this.setState({ proposals });
  }
  loadChannels() {
    const channels = this.load("channels");
    if (channels) this.setState({ channels });
  }
  loadCategories() {
    const categories = this.load("categories");
    if (categories) this.setState({ categories });
  }
  loadPosts() {
    const posts = this.load("posts");
    if (posts) this.setState({ posts });
  }
  loadThreads() {
    const threads = this.load("threads");
    if (threads) this.setState({ threads });
  }

  loadValidators() {
    const validators = this.load("validators");
    if (validators) this.setState({ validators });
  }
  loadNominators() {
    const nominators = this.load("nominators");
    if (nominators) this.setState({ nominators });
  }
  loadHandles() {
    const handles = this.load("handles");
    if (handles) this.setState({ handles });
  }
  loadReports() {
    const reports = this.load("reports");
    if (!reports) return this.fetchReports();
    this.setState({ reports });
  }
  loadTokenomics() {
    const tokenomics = this.load("tokenomics");
    if (tokenomics) this.setState({ tokenomics });
  }
  loadMint() {
    const mint = this.load("mint");
    if (mint) this.setState({ mint });
  }
  clearData() {
    this.save("version", version);
    this.save("proposals", []);
  }
  async loadData() {
    const lastVersion = this.load("version");
    if (lastVersion !== version) return this.clearData();
    console.log(`Loading data`);
    await this.loadMembers();
    await this.loadCouncils();
    await this.loadCategories();
    await this.loadChannels();
    await this.loadProposals();
    await this.loadPosts();
    await this.loadThreads();
    await this.loadValidators();
    await this.loadNominators();
    await this.loadHandles();
    await this.loadTokenomics();
    await this.loadReports();
    this.setState({ loading: false });
  }

  load(key: string) {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.log(`Failed to load ${key}`, e);
    }
  }
  save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.log(`Failed to save ${key}`, e);
    } finally {
      //console.log(`saving ${key}`, data);
      this.setState({ [key]: data });
    }
  }

  render() {
    if (this.state.loading) return <Loading />;
    return <Routes getHandle={this.getHandle} {...this.state} />;
  }

  componentDidMount() {
    this.loadData();
    this.initializeSocket();
    this.fetchTokenomics();
    setInterval(this.fetchTokenomics, 300000);
  }
  componentWillUnmount() {
    console.log("unmounting...");
  }
  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.fetchTokenomics = this.fetchTokenomics.bind(this);
    this.fetchProposal = this.fetchProposal.bind(this);
    this.getHandle = this.getHandle.bind(this);
  }
}

export default App;
