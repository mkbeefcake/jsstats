import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";
import proposalPosts from "./proposalPosts";
import axios from "axios";
import { ProposalDetail } from "./types";

import {
  Api,
  Block,
  Handles,
  IState,
  Member,
  Category,
  Channel,
  Post,
  Seat,
  Thread,
} from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";
import { VoteKind } from "@joystream/types/proposals";

interface IProps {}

const version = 0.3;

const initialState = {
  connecting: true,
  loading: true,
  blocks: [],
  now: 0,
  block: 0,
  era: 0,
  issued: 0,
  price: 0,
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
  termEndsAt: 0,
  stage: {},
  stakes: {},
  stashes: [],
  stars: {},
  lastReward: 0,
  hideFooter: false,
};

class App extends React.Component<IProps, IState> {
  async initializeSocket() {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);
    const api = await ApiPromise.create({ provider, types });
    await api.isReady;
    this.setState({ connecting: false });
    console.log(`Connected to ${wsLocation}`);

    let blocks: Block[] = [];
    let lastBlock: Block = { id: 0, timestamp: 0, duration: 6 };
    let era = 0;

    let termEndsAt = Number((await api.query.council.termEndsAt()).toJSON());
    this.save("termEndsAt", termEndsAt);
    let round: number = Number(
      (await api.query.councilElection.round()).toJSON()
    );
    this.save("round", round);
    let stage: any = await api.query.councilElection.stage();
    this.save("stage", stage);
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

    let lastMember = await api.query.members.nextMemberId();
    this.fetchMembers(api, Number(lastMember));

    api.rpc.chain.subscribeNewHeads(
      async (header: Header): Promise<void> => {
        // current block
        const id = header.number.toNumber();
        if (blocks.find((b) => b.id === id)) return;
        const timestamp = (await api.query.timestamp.now()).toNumber();
        const duration = timestamp - lastBlock.timestamp;
        const block: Block = { id, timestamp, duration };
        blocks = blocks.concat(block);
        this.setState({ blocks, loading: false });
        this.save("block", id);
        this.save("now", timestamp);

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

        // validators
        const currentEra = Number(await api.query.staking.currentEra());
        if (currentEra > era) {
          era = currentEra;
          this.fetchStakes(api, era, this.state.validators);
          this.save("era", era);
          this.fetchLastReward(api, era - 1);
        } else if (this.state.lastReward === 0)
          this.fetchLastReward(api, currentEra);

        this.fetchEraRewardPoints(api, Number(era));

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

  async fetchLastReward(api: Api, era: number) {
    const lastReward = Number(await api.query.staking.erasValidatorReward(era));
    console.debug(`last reward`, era, lastReward);
    if (lastReward > 0) this.save("lastReward", lastReward);
    else this.fetchLastReward(api, era - 1);
  }

  async fetchTokenomics() {
    console.debug(`Updating tokenomics`);
    const { data } = await axios.get("https://status.joystream.org/status");
    if (!data) return;
    this.save("tokenomics", data);
  }

  async fetchChannels(api: Api, lastId: number) {
    for (let id = lastId; id > 0; id--) {
      if (this.state.channels.find((c) => c.id === id)) continue;
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
    const proposalCount = await get.proposalCount(api);
    for (let i = proposalCount; i > 0; i--) this.fetchProposal(api, i);
  }
  async fetchProposal(api: Api, id: number) {
    const { proposals } = this.state;
    const exists = this.state.proposals.find((p) => p && p.id === id);

    if (exists && exists.detail && exists.stage === "Finalized")
      if (exists.votesByAccount && exists.votesByAccount.length) return;
      else return this.fetchVotesPerProposal(api, exists);

    console.debug(`Fetching proposal ${id}`);
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
    this.updateHandles(members);
    this.setState({ members });
  }
  loadCouncils() {
    const councils = this.load("councils");
    if (!councils || !councils.length || typeof councils[0][0] === "number")
      return;
    this.setState({ councils });
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

    const stashes = this.load("stashes") || [];
    if (stashes) this.setState({ stashes });
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
  loadStakes() {
    const stakes = this.load("stakes");
    if (stakes) this.setState({ stakes });
  }

  clearData() {
    this.save("version", version);
    this.save("proposals", []);
  }
  async loadData() {
    const lastVersion = this.load("version");
    if (lastVersion !== version) return this.clearData();
    console.log(`Loading data`);
    const termEndsAt = this.load("termEndsAt");
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
    await this.loadStakes();
    const block = this.load("block");
    const now = this.load("now");
    const era = this.load("era") || `..`;
    const round = this.load("round");
    const stage = this.load("stage");
    const stars = this.load("stars") || {};
    const lastReward = this.load("lastReward") || 0;
    const loading = false;
    this.setState({
      block,
      era,
      now,
      round,
      stage,
      stars,
      termEndsAt,
      loading,
      lastReward,
    });
    console.debug(`Finished loading.`);
  }

  load(key: string) {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed to load ${key}`, e);
    }
  }
  save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Failed to save ${key}`, e);
    } finally {
      //console.debug(`saving ${key}`, data);
      this.setState({ [key]: data });
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

  componentDidMount() {
    this.loadData();
    this.initializeSocket();
    this.fetchTokenomics();
    setInterval(this.fetchTokenomics, 900000);
  }
  componentWillUnmount() {
    console.debug("unmounting...");
  }
  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.fetchTokenomics = this.fetchTokenomics.bind(this);
    this.fetchProposal = this.fetchProposal.bind(this);
    this.load = this.load.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
  }
}

export default App;
