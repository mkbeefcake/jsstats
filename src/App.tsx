import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import moment from "moment";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";

// types
import { Api, Block, NominatorsEntries, Proposals } from "./types";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";
import { ValidatorId } from "@polkadot/types/interfaces";

interface IProps {}

interface IState {
  block: number;
  blocks: Block[];
  nominators: string[];
  validators: string[];
  loading: boolean;
  council: any;
  channels: number[];
  proposals: any;
  posts: number[];
  categories: number[];
  threads: number[];
  domain: string;
  proposalCount: number;
  handles: any;
}

const initialState = {
  blocks: [],
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
    //this.setState({loading:false})

    // const [chain, node, version] = await Promise.all([
    //   api.rpc.system.chain(),
    //   api.rpc.system.name(),
    //   api.rpc.system.version()
    // ]);
    // this.setState({ chain, node, version, loading: false });

    let blocks: Block[] = [];
    let lastBlock: Block = { id: 0, timestamp: 0, duration: 6 };
    let openingId = await get.nextOpeningId(api);
    let nextWorkerId = await get.nextWorkerId(api);

    let channels = [];
    channels[0] = await get.currentChannelId(api);

    let posts = [];
    posts[0] = await get.currentPostId(api);
    let categories = [];
    categories[0] = await get.currentCategoryId(api);
    let threads = [];
    threads[0] = await get.currentThreadId(api);

    let { proposals } = this.state;
    const proposalCount = await get.proposalCount(api);
    for (let i = proposalCount; i > 0; i--) {
      this.fetchProposal(api, i);
    }

    //proposals.last = await get.proposalCount(api);
    //proposals.active = await get.activeProposalCount(api);
    //proposals.executing = await get.pendingProposals(api);

    this.setState({ channels, proposalCount, posts, categories, threads });

    const council: any = await api.query.council.activeCouncil();
    console.log(`council`, council);
    council.map((seat: any) => this.fetchHandle(api, seat.member));

    // count nominators and validators
    const validatorEntries = await api.query.session.validators();
    const nominatorEntries = await api.query.staking.nominators.entries();
    const validators = await validatorEntries.map((v) => {
      this.fetchHandle(api, v.toJSON());
      return String(v);
    });
    console.log(`validators`, validators);
    const nominators = nominatorEntries.map((n) => {
      const name = n[0].toHuman();
      this.fetchHandle(api, `${name}`);
      return `${name}`;
    });
    console.log(`nominators`, nominatorEntries);

    this.setState({ council, nominators, validators, loading: false });

    api.rpc.chain.subscribeNewHeads(
      async (header: Header): Promise<void> => {
        // current block
        const id = header.number.toNumber();
        if (blocks.find((b) => b.id === id)) return;
        const timestamp = (await api.query.timestamp.now()).toNumber();
        const duration = timestamp - lastBlock.timestamp;
        const block: Block = { id, timestamp, duration };
        blocks = blocks.concat(block);
        this.setState({ blocks, block: id });

        channels[1] = await get.currentChannelId(api);
        proposals.current = await get.proposalCount(api);
        categories[1] = await get.currentCategoryId(api);
        posts[1] = await get.currentPostId(api);
        threads[1] = await get.currentThreadId(api);
        lastBlock = block;

        // test storage providers
        // if (block.timestamp > lastCheck + checkPeriod) {
        //   lastCheck = block.timestamp;
        // }
        // new storage provider (or lead) opportunity is opened
        // const nextOpeningId = await get.nextOpeningId(api);
        // if (nextOpeningId > openingId) {
        //   openingId = nextOpeningId;
        // }

        // storage provider (or lead) opportunity is closed
        // const workerId = await get.nextWorkerId(api);
        // if (workerId > nextWorkerId) {
        //   const worker = await api.query.storageWorkingGroup.workerById(
        //     workerId - 1
        //   );
        //   const memberId = worker.member_id.toJSON();
        //   const handle: string = await get.memberHandle(api, memberId);
        //   nextWorkerId = workerId;
        // }

        lastBlock = block;
      }
    );
  }

  async fetchProposal(api: Api, id: number) {
    const proposal = await get.proposalDetail(api, id);
    let { proposals } = this.state;
    proposals[id] = proposal;
    this.setState({ proposals });
  }
  async fetchHandle(api: Api, id: string) {
    const handle = await get.memberHandleByAccount(api, id);
    //if (handle === "") return;
    let { handles } = this.state;
    handles[String(id)] = handle;
    this.setState({ handles });
  }

  // async fetchData() {
  //   // inital axios requests go here
  //   this.setState({ loading: false });
  // }

  render() {
    if (this.state.loading) return <Loading />;
    return <Routes {...this.state} />;
  }

  componentDidMount() {
    this.initializeSocket();
    //this.fetchData()
  }
  componentWillUnmount() {
    console.log("unmounting...");
  }
  constructor(props: any) {
    super(props);
    this.state = initialState;
    this.fetchProposal = this.fetchProposal.bind(this);
    this.fetchHandle = this.fetchHandle.bind(this);
  }
}

export default App;
