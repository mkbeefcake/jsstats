import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";

// types
import { Api, Block, IState } from "./types";
import { types } from "@joystream/types";
import { Seat } from "@joystream/types/augment/all/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { AccountId, Header } from "@polkadot/types/interfaces";

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
        lastBlock = block;
      }
    );

    if (!this.state.council.length) this.fetchCouncil(api);
    this.fetchProposals(api);
    if (!this.state.validators.length) this.fetchValidators(api);
    if (!this.state.nominators.length) this.fetchNominators(api);
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
  async fetchHandle(api: Api, id: AccountId | string) {
    let { handles } = this.state;
    if (handles[String(id)]) return;

    const handle = await get.memberHandleByAccount(api, id);
    handles[String(id)] = handle;
    this.save("handles", handles);
  }

  loadCouncil() {
    const council = this.load("council");
    if (council) this.setState({ council });
  }
  loadProposals() {
    const proposals = this.load("proposals");
    if (proposals) this.setState({ proposals });
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
  async loadData() {
    await this.loadCouncil();
    await this.loadProposals();
    await this.loadValidators();
    await this.loadNominators();
    await this.loadHandles();
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
