import { Component } from "react";
import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import * as get from "./lib/getters";
import { getCouncilApplicants, getCouncilSize, getVotes } from "./lib/election";
import {
  getStashes,
  getNominators,
  getValidators,
  getValidatorStakes,
  getEraRewardPoints,
  getLastReward,
  getTotalStake,
} from "./lib/validators";
import { getBlockHash, getEvents, getTimestamp } from "./jslib";
import { wsLocation } from "./config";

export const connectApi = () => {
  console.info(`Connecting to ${wsLocation}`);
  const provider = new WsProvider(wsLocation);
  return ApiPromise.create({ provider, types }).then(async (api) => {
    await api.isReady;

    const [chain, nodeName, nodeVersion, runtimeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.runtimeVersion,
    ]);
    console.log(
      `Connected to ${wsLocation}: ${chain} spec:${runtimeVersion.specVersion} (${nodeName} v${nodeVersion})`
    );
    this.setState({ connected: true });
    api.rpc.chain.subscribeFinalizedHeads((header: Header) =>
      this.handleBlock(api, header)
    );
    this.syncBlocks(api);
  });
};

class JoystreamApi extends Component {
  api = connectApi(); // joystream API endpoint

  async handleBlock(api: ApiPromise, header: Header) {
    let { status } = this.state;
    const id = header.number.toNumber();

    //const isEven = id / 50 === Math.floor(id / 50);
    //if (isEven || status.block?.id + 50 < id) this.updateStatus(api, id);
    if (this.state.blocks.find((b) => b.id === id)) return;

    const timestamp = (await api.query.timestamp.now()).toNumber();
    //const duration = status.block ? timestamp - status.block.timestamp : 6000;
    const hash = await getBlockHash(api, id);
    const events = (await getEvents(api, hash)).map((e) => {
      const { section, method, data } = e.event;
      return { blockId: id, section, method, data: data.toHuman() };
    });
    status.block = { id, timestamp, events };
    console.info(`new finalized head`, status.block);
    this.save("status", status);
    this.save("blocks", this.state.blocks.concat(status.block));
  }

  async syncBlocks(api: ApiPromise) {
    const head = this.state.blocks.reduce(
      (max, b) => (b.id > max ? b.id : max),
      0
    );
    console.log(`Syncing block events from ${head}`);
    let missing = [];
    for (let id = head; id > 0; --id) {
      if (!this.state.blocks.find((block) => block.id === id)) missing.push(id);
    }
    if (!this.state.syncEvents) return;
    const maxWorkers = 5;
    let slots = [];
    for (let s = 0; s < maxWorkers; ++s) {
      slots[s] = s;
    }
    slots.map(async (slot) => {
      while (this.state.syncEventsl && missing.length) {
        const id = slot < maxWorkers / 2 ? missing.pop() : missing.shift();
        await this.syncBlock(api, id, slot);
      }
      console.debug(`Slot ${slot} idle.`);
      return true;
    });
  }

  async syncBlock(api: ApiPromise, id: number, slot: number) {
    try {
      const hash = await getBlockHash(api, id);
      const events = (await getEvents(api, hash))
        .map((e) => {
          const { section, method, data } = e.event;
          return { blockId: id, section, method, data: data.toHuman() };
        })
        .filter((e) => e.method !== "ExtrinsicSuccess");
      const timestamp = (await api.query.timestamp.now.at(hash)).toNumber();
      //const duration = 6000 // TODO update later
      const block = { id, timestamp, events };
      console.debug(`worker ${slot}: synced block`, block);
      this.save("blocks", this.state.blocks.concat(block));
    } catch (e) {
      console.error(`Failed to get block ${id}: ${e.message}`);
    }
  }

  async updateStatus(api: ApiPromise, id: number): Promise<Status> {
    console.debug(`#${id}: Updating status`);
    //this.updateActiveProposals();
    //getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));

    let { status, councils } = this.state;
    //status.election = await updateElection(api);
    //if (status.election?.stage) this.getElectionStatus(api);
    councils.forEach((c) => {
      if (c?.round > status.council) status.council = c;
    });

    let hash: string = await getBlockHash(api, 1);
    if (hash) status.startTime = await getTimestamp(api, hash);

    const nextMemberId = await await api.query.members.nextMemberId();
    status.members = nextMemberId - 1;
    this.fetchMembers(api, status.members);
    status.proposals = await get.proposalCount(api);
    status.posts = await get.currentPostId(api);
    status.threads = await get.currentThreadId(api);
    status.categories = await get.currentCategoryId(api);
    status.proposalPosts = await api.query.proposalsDiscussion.postCount();
    await this.updateEra(api, status.era).then(async (era) => {
      status.era = era;
      status.lastReward = await getLastReward(api, era);
      status.validatorStake = await getTotalStake(api, era);
      this.save("status", status);
    });
    return status;
  }

  fetchMembers(api: ApiPromise, max: number) {
    // fallback for failing cache
    let missing = [];
    for (let id = max; id > 0; --id) {
      if (!this.state.members.find((m) => m.id === id)) missing.push(id);
    }
    if (missing.length < 100)
      missing.forEach((id) => this.fetchMember(api, id));
    else
      api.query.members.membershipById.entries().then((map) => {
        let members = [];
        for (const [storageKey, member] of map) {
          members.push({ ...member.toJSON(), id: storageKey.args[1] });
        }
        this.save("members", members);
        console.debug(`got members`, members);
      });
  }

  fetchMember(api: ApiPromise, id: number) {
    get.membership(api, id).then((member) => {
      console.debug(`got member ${id} ${member.handle}`);
      const members = this.state.members.filter((m) => m.id !== id);
      this.save("members", members.concat({ ...member, id }));
    });
  }

  async getElectionStatus(api: ApiPromise): Promise<IElectionState> {
    getCouncilSize(api).then((councilSize) => {
      let election = this.state.election;
      election.councilSize = councilSize;
      this.save("election", election);
    });
    getVotes(api).then((votes) => {
      let election = this.state.election;
      election.votes = votes;
      this.save("election", election);
    });
    getCouncilApplicants(api).then((applicants) => {
      let election = this.state.election;
      election.applicants = applicants;
      this.save("election", election);
    });
  }

  updateActiveProposals() {
    const active = this.state.proposals.filter((p) => p.result === "Pending");
    if (!active.length) return;
    const s = active.length > 1 ? `s` : ``;
    console.log(`Updating ${active.length} active proposal${s}`);
    active.forEach(async (a) => {
      const { data } = await axios.get(`${apiLocation}/v2/proposals/${a.id}`);
      if (!data || data.error)
        return console.error(`failed to fetch proposal from API`);
      this.save(
        "proposals",
        this.state.proposals.map((p) => (p.id === a.id ? data : p))
      );
    });
  }

  async updateEra(api: Api, old: number) {
    const { status, validators } = this.state;
    const era = Number(await api.query.staking.currentEra());
    if (era === old) return era;
    this.updateValidatorPoints(api, status.era);
    if (era > status.era || !validators.length) this.updateValidators(api);
    return era;
  }

  updateValidators(api: ApiPromise) {
    getValidators(api).then((validators) => {
      this.save("validators", validators);
      getNominators(api).then((nominators) => {
        this.save("nominators", nominators);
        getStashes(api).then((stashes) => {
          this.save("stashes", stashes);
          const { status, members } = this.state;
          const { era } = status;
          getValidatorStakes(api, era, stashes, members, this.save).then(
            (stakes) => this.save("stakes", stakes)
          );
        });
      });
    });
  }

  async updateValidatorPoints(api: ApiPromise, currentEra: number) {
    let points = this.state.rewardPoints;

    const updateTotal = (eraTotals) => {
      let total = 0;
      Object.keys(eraTotals).forEach((era) => (total += eraTotals[era]));
      return total;
    };

    for (let era = currentEra; era > currentEra - historyDepth; --era) {
      if (era < currentEra && points.eraTotals[era]) continue;
      getEraRewardPoints(api, era).then((eraPoints) => {
        console.debug(`era ${era}: ${eraPoints.total} points`);
        points.eraTotals[era] = eraPoints.total;
        points.total = updateTotal(points.eraTotals);
        Object.keys(eraPoints.individual).forEach((validator: string) => {
          if (!points.validators[validator]) points.validators[validator] = {};
          points.validators[validator][era] = eraPoints.individual[validator];
        });
        this.save("rewardPoints", points);
      });
    }
  }

  async updateCouncils() {
    queryJstats(`v1/councils`).then((councils) => {
      if (!councils) return;
      this.save(`councils`, councils);

      // TODO OPTIMIZE find max round
      let council = { round: 0 };
      councils.forEach((c) => {
        if (c.round > council.round) council = c;
      });
      let { status } = this.state;
      status.council = council; // needed by dashboard
      this.save("status", status);
    });
  }

  getMember(input: string) {
    const { members } = this.state;
    let member;
    // search by handle
    member = members.find((m) => m.handle === input);
    if (member) return member;

    // search by key
    member = members.find((m) => m.rootKey === input);
    if (member) return member;

    // TODO fetch live
    //member = await get.membership(this.api, input)
    //member = await get.memberIdByAccount(this.api, input)
    return {};
  }

  render() {
    return <div />;
  }
}

export default JoystreamApi;
