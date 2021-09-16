import { ApiPromise, WsProvider } from "@polkadot/api";
import { types } from "@joystream/types";
import { AccountId, Hash } from "@polkadot/types/interfaces";
import { config } from "dotenv";
import BN from "bn.js";
import { Option, Vec } from "@polkadot/types";
import { wsLocation } from "./config";
import { MemberId } from "@joystream/types/members";
import { Member, IApplicant, IVote } from "./types";
import { PromiseAllObj } from "./components/ValidatorReport/utils";
import { IElectionStake, SealedVote } from "@joystream/types/council";

config();

export class JoyApi {
  endpoint: string;
  isReady: Promise<ApiPromise>;
  api!: ApiPromise;

  constructor() {
    this.endpoint = wsLocation;
    this.isReady = (async () =>
      await new ApiPromise({ provider: new WsProvider(wsLocation), types })
        .isReadyOrError)();
  }

  get init(): Promise<JoyApi> {
    return this.isReady.then((instance) => {
      this.api = instance;
      return this;
    });
  }

  async finalizedHash() {
    return this.api.rpc.chain.getFinalizedHead();
  }

  async councilRound(): Promise<Number> {
    return Number((await this.api.query.councilElection.round()).toJSON());
  }

  async councilSize(): Promise<Number> {
    return Number((await this.api.query.councilElection.councilSize()).toJSON());
  }

  async termEndsAt(): Promise<Number> {
    return Number((await this.api.query.council.termEndsAt()).toJSON());
  }

  async stage(): Promise<{ [key: string]: Number }> {
    const stage = (await this.api.query.councilElection.stage()).toJSON();
    return stage as unknown as { [key: string]: Number };
  }

  async getCouncilApplicants(): Promise<IApplicant[]> {
    const addresses: AccountId[] = (
      await this.api.query.councilElection.applicants()
    ).toJSON() as unknown as AccountId[];
    const members = await Promise.all(
      addresses.map(async (address) => {
        return PromiseAllObj({
          address: address,
          memberId: await this.api.query.members.memberIdsByRootAccountId(
            address as unknown as AccountId
          ),
        });
      })
    );
    return (await Promise.all(
      members.map(async (member) => {
        const { memberId, address } = member;
        const id = (memberId as unknown as MemberId[])[0] as MemberId;
        return PromiseAllObj({
          member: (await this.api.query.members.membershipById(
            id
          )) as unknown as Member,
          electionStake: (
            await this.api.query.councilElection.applicantStakes(address)
          ).toJSON() as unknown as IElectionStake,
        } as IApplicant);
      })
    )) as IApplicant[];
  }

  async getVotes(): Promise<IVote[]> {
    const commitments: AccountId[] = (
      await this.api.query.councilElection.commitments()
    ).toJSON() as unknown as AccountId[];
    const votes = await Promise.all(
      commitments.map(async (hash) => {
        const vote = (await this.api.query.councilElection.votes(
          hash
        )) as unknown as SealedVote;
        const newStake = vote.stake.new;
        const transferredStake = vote.stake.transferred;
        const voterId = await this.api.query.members.memberIdsByRootAccountId(
          vote.voter
        );
        const voterMembership = (await this.api.query.members.membershipById(
          voterId
        )) as unknown as Member;
        const voterHandle = voterMembership.handle;
        const candidateId = `${vote.vote}`;
        if (
          candidateId === "" ||
          candidateId === null ||
          candidateId === undefined
        ) {
          return {
            voterHandle: voterHandle,
            voterId: voterId as unknown as Number,
            newStake: newStake as unknown as Number,
            transferredStake: transferredStake as unknown as Number,
          } as IVote;
        } else {
          const voteId = await this.api.query.members.memberIdsByRootAccountId(
            candidateId
          );
          const voteMembership = (await this.api.query.members.membershipById(
            voteId
          )) as unknown as Member;
          const voteHandle = voteMembership.handle;
          return {
            voterHandle: voterHandle,
            voterId: voterId as unknown as Number,
            candidateHandle: voteHandle,
            candidateId: voteId as unknown as Number,
            newStake: newStake as unknown as Number,
            transferredStake: transferredStake as unknown as Number,
          } as IVote;
        }
      })
    );
    return votes;
  }

  async finalizedBlockHeight() {
    const finalizedHash = await this.finalizedHash();
    const { number } = await this.api.rpc.chain.getHeader(`${finalizedHash}`);
    return number.toNumber();
  }

  async findActiveValidators(
    hash: Hash,
    searchPreviousBlocks: boolean
  ): Promise<AccountId[]> {
    const block = await this.api.rpc.chain.getBlock(hash);

    let currentBlockNr = block.block.header.number.toNumber();
    let activeValidators;
    do {
      let currentHash = (await this.api.rpc.chain.getBlockHash(
        currentBlockNr
      )) as Hash;
      let allValidators = (await this.api.query.staking.snapshotValidators.at(
        currentHash
      )) as Option<Vec<AccountId>>;
      if (!allValidators.isEmpty) {
        let max = (
          await this.api.query.staking.validatorCount.at(currentHash)
        ).toNumber();
        activeValidators = Array.from(allValidators.unwrap()).slice(0, max);
      }

      if (searchPreviousBlocks) {
        --currentBlockNr;
      } else {
        ++currentBlockNr;
      }
    } while (activeValidators === undefined);
    return activeValidators;
  }

  async validatorsData() {
    const validators = await this.api.query.session.validators();
    const era = await this.api.query.staking.currentEra();
    const totalStake = era.isSome
      ? await this.api.query.staking.erasTotalStake(era.unwrap())
      : new BN(0);

    return {
      count: validators.length,
      validators: validators.toJSON(),
      total_stake: totalStake.toNumber(),
    };
  }
}
