import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";
import proposalPosts from "./proposalPosts"; // TODO OPTIMIZE
import axios from "axios";

// types
import { Api, Block, IState } from "./types";
import { types } from "@joystream/types";
import { Seat } from "@joystream/types/augment/all/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { AccountId, Header } from "@polkadot/types/interfaces";
import { MemberId, Membership } from "@joystream/types/members";

interface IProps {}

const initialState = {
  blocks: [],
  now: 0,
  block: 0,
  loading: true,
  nominators: [],
  validators: [],
  channels: [],
  posts: [],
  council: [],
  categories: [],
  threads: [],
  proposals: [],
  proposalCount: 0,
  domain,
  handles: {},
  proposalPosts,
  reports: {},
};

class App extends React.Component<IProps, IState> {
  async initializeSocket() {
    const provider = new WsProvider(wsLocation);
    const api = await ApiPromise.create({ provider, types });
    await api.isReady;

    let blocks: Block[] = [];
    let lastBlock: Block = { id: 0, timestamp: 0, duration: 6 };

    // let channels = [];
    // channels[0] = await get.currentChannelId(api);
    // let posts = [];
    // posts[0] = await get.currentPostId(api);
    // let categories = [];
    // categories[0] = await get.currentCategoryId(api);
    // let threads = [];
    // threads[0] = await get.currentThreadId(api);
    // this.setState({ channels, posts, categories, threads });

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

        // channels[1] = await get.currentChannelId(api);
        // categories[1] = await get.currentCategoryId(api);
        // posts[1] = await get.currentPostId(api);
        // threads[1] = await get.currentThreadId(api);

        const postCount = await api.query.proposalsDiscussion.postCount();
        this.setState({ proposalComments: Number(postCount) });

        lastBlock = block;
      }
    );

    if (!this.state.council.length) this.fetchCouncil(api);
    this.fetchProposals(api);
    if (!this.state.validators.length) this.fetchValidators(api);
    if (!this.state.nominators.length) this.fetchNominators(api);
    //this.fetchTokenomics(api);
  }

  async fetchStatus() {
    const { data } = await axios.get("https://status.joystream.org/status");
    if (!data) return;
    this.save("tokenomics", data);
  }

  async fetchTokenomics(api: Api) {
    const totalIssuance = (await api.query.balances.totalIssuance()).toNumber();
    const tokenomics = { totalIssuance };
    this.save("tokenomics", tokenomics);
  }

  async fetchCouncil(api: Api) {
    const council: any = await api.query.council.activeCouncil();
    this.save(`council`, council);
    council.map((seat: Seat) => this.fetchHandle(api, seat.member));
  }

  async fetchProposals(api: Api) {
    const proposalCount = await get.proposalCount(api);
    for (let i = proposalCount; i > 0; i--) this.fetchProposal(api, i);
  }
  async fetchProposal(api: Api, id: number) {
    let { proposals } = this.state;
    const exists = proposals.find((p) => p && p.id === id);

    if (exists && exists.stage === "Finalized") return;
    const proposal = await get.proposalDetail(api, id);
    if (!proposal) return;
    proposals[id] = proposal;
    this.save("proposals", proposals);
    this.fetchVotesPerProposal(api, id);
  }

  async fetchVotesPerProposal(api: Api, proposalId: number) {
    const { proposals } = this.state;
    const proposal = proposals.find((p) => p && p.id === proposalId);
    if (!proposal) return;
    const { id, createdAt, votes } = proposal;

    //let totalVotes = 0;
    //Object.keys(votes).map((key) => (totalVotes += votes[key]));

    const council = this.getCouncilAtBlock(createdAt);

    proposal.votesByMember = await Promise.all(
      council.map(async (seat: Seat) => {
        const memberId = await this.getMemberIdByAccount(api, seat.member);
        const handle = await this.getHandleByAccount(api, seat.member);
        const vote = await this.fetchVoteByProposalByVoter(api, id, memberId);
        return { vote: String(vote), account: seat.member, handle };
      })
    );
    proposals[id] = proposal;
    this.save("proposals", proposals);
  }

  async fetchVoteByProposalByVoter(
    api: Api,
    proposalId: number,
    memberId: MemberId
  ) {
    //const councilPerBlock
    const vote = await api.query.proposalsEngine.voteExistsByProposalByVoter(
      proposalId,
      memberId
    );
    return vote.toHuman();
  }

  getCouncilAtBlock(block: number) {
    // TODO
    return this.state.council;
  }

  async getHandleByAccount(api: Api, accountId: AccountId): Promise<string> {
    return await this.fetchHandle(api, accountId);
  }
  async getMemberIdByAccount(
    api: Api,
    accountId: AccountId
  ): Promise<MemberId> {
    const id: MemberId = await api.query.members.memberIdsByRootAccountId(
      accountId
    );
    return id;
  }

  async fetchNominators(api: Api) {
    const nominatorEntries = await api.query.staking.nominators.entries();
    const nominators = nominatorEntries.map((n: any) => {
      const name = n[0].toHuman();
      this.fetchHandle(api, `${name}`);
      return `${name}`;
    });
    this.save("nominators", nominators);
  }
  async fetchValidators(api: Api) {
    const validatorEntries = await api.query.session.validators();
    const validators = await validatorEntries.map((v: any) => {
      this.fetchHandle(api, v.toJSON());
      return String(v);
    });
    this.save("validators", validators);
  }
  async fetchHandle(api: Api, id: AccountId | string): Promise<string> {
    let { handles } = this.state;
    const exists = handles[String(id)];
    if (exists) return exists;

    const handle = await get.memberHandleByAccount(api, id);
    handles[String(id)] = handle;
    this.save("handles", handles);
    return handle;
  }
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

  loadCouncil() {
    const council = this.load("council");
    if (council) this.setState({ council });
  }
  loadProposals() {
    const proposals = this.load("proposals");
    if (proposals) this.setState({ proposals });
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
    //console.log(`loaded reports`, reports);
    this.setState({ reports });
  }
  loadTokenomics() {
    const tokenomics = this.load("tokenomics");
    this.setState({ tokenomics });
  }
  async loadData() {
    await this.loadCouncil();
    await this.loadProposals();
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
    return <Routes {...this.state} />;
  }

  componentDidMount() {
    this.loadData();
    this.fetchStatus();
    this.initializeSocket();
  }
  componentWillUnmount() {
    console.log("unmounting...");
  }
  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.fetchProposal = this.fetchProposal.bind(this);
    this.fetchHandle = this.fetchHandle.bind(this);
  }
}

export default App;
