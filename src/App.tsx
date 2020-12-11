import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Loading } from "./components";
import * as get from "./lib/getters";
import { domain, wsLocation } from "./config";

// types
import { Api, Block, IState } from "./types";
import { types } from "@joystream/types";
//import { Observable } from "@polkadot/types/types";
import { Seat } from "@joystream/types/augment/all/types";
//import { Vec } from "@polkadot/types/codec";
//import { Codec } from "@polkadot/types/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { AccountId, Header } from "@polkadot/types/interfaces";

interface IProps {}

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
    this.setState({ loading: false });

    let blocks: Block[] = [];
    let lastBlock: Block = { id: 0, timestamp: 0, duration: 6 };

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

    this.setState({ channels, proposalCount, posts, categories, threads });

    // TODO typeof activeCouncil
    // Type 'Codec' is missing the following properties from type 'Observable<Vec<Seat>>': _isScalar,
    // Type 'Codec' is missing the following properties from type 'Observable<any>': _isScalar, source
    const council: any = await api.query.council.activeCouncil();
    console.log(`council`, council);
    // Property 'map' does not exist on type 'Codec'.  TS2339
    council.map((seat: Seat) => this.fetchHandle(api, seat.member));

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
      }
    );
  }

  async fetchProposal(api: Api, id: number) {
    const proposal = await get.proposalDetail(api, id);
    let { proposals } = this.state;
    proposals[id] = proposal;
    this.setState({ proposals });
  }
  async fetchHandle(api: Api, id: AccountId | string) {
    const handle = await get.memberHandleByAccount(api, id);
    let { handles } = this.state;
    handles[String(id)] = handle;
    this.setState({ handles });
  }

  render() {
    if (this.state.loading) return <Loading />;
    return <Routes {...this.state} />;
  }

  componentDidMount() {
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
