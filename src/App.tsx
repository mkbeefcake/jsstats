import React from "react";
import { Dashboard, Loading } from "./components";
//import { withRouter } from "react-router-dom";
import moment from "moment";
import * as get from "./lib/getters";
import { wsLocation } from "./config";

// types
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";

const initialState = { blocks: [], block: 0, loading: true };

class App extends React.Component {
  async initializeSocket() {
    const provider = new WsProvider(wsLocation);
    const api = await ApiPromise.create({ provider, types });
    await api.isReady;

    const [chain, node, version] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);
    this.setState({ chain, node, version, loading: false });

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

    let proposals = [];
    proposals.last = await get.proposalCount(api);
    proposals.active = await get.activeProposals(api);
    proposals.executing = await get.pendingProposals(api);

    this.setState({ channels, proposals, posts, categories, threads });

    api.rpc.chain.subscribeNewHeads(
      async (header: Header): Promise<void> => {
        // current block
        const id = header.number.toNumber();
        if (lastBlock.id === id) return;
        const timestamp = (await api.query.timestamp.now()).toNumber();
        const duration = timestamp - lastBlock.timestamp;
        const block = { id, timestamp, duration };
        let { blocks, nominators, validators } = summary;
        blocks = blocks.concat(block);
        const summary = { blocks, nominators, validators };

        // count nominators and validators
        const nominatorsEntries: NominatorsEntries = await api.query.staking.nominators.entries();
        const currentValidators = await api.query.staking.validatorCount();
        nominators = nominators.concat(nominatorsEntries.length);
        validators = validators.concat(currentValidators.toNumber());
        summary = { blocks: [], nominators: [], validators: [] };

        channels[1] = await get.currentChannelId(api);
        proposals.current = await get.proposalCount(api);
        cats[1] = await get.currentCategoryId(api);
        posts[1] = await get.currentPostId(api);
        threads[1] = await get.currentThreadId(api);
        lastBlock = block;

        // test storage providers
        if (block.timestamp > lastCheck + checkPeriod) {
          lastCheck = block.timestamp;
        }
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
        this.setState({ blocks, block: header.number.toNumber(), summary });
      }
    );
  }

  // async fetchData() {
  //   // inital axios requests go here
  //   this.setState({ loading: false });
  // }

  /** RENDER FUNCTIONS **/
  renderLoading() {
    return <Loading />;
  }
  renderError() {
    if (this.state.showModal === "Error") return;
    this.setShowModal("Error");
  }
  renderApp() {
    return <Dashboard {...this.state} />;
  }
  render() {
    if (this.state.loading) return this.renderLoading();
    if (this.state.error) this.renderError();
    if (this.state.component === "layout") return <Layout {...this.state} />;
    return this.renderApp();
  }

  componentDidMount() {
    this.initializeSocket();
    //this.fetchData()
  }
  componentWillUnmount() {
    console.log("unmounting...");
  }
  constructor() {
    super();
    this.state = initialState;
  }
}

export default App;
//export default withRouter(App);
