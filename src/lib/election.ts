import { ApiPromise } from "@polkadot/api";
import { AccountId } from "@polkadot/types/interfaces";
import { MemberId } from "../ptypes";
import { Member, IApplicant, IVote } from "../ptypes";
import { IElectionStake, SealedVote } from "../ptypes";

export const finalizedBlockHeight = async (api: ApiPromise) => {
  const hash = await finalizedHash(api);
  const { number } = await api.rpc.chain.getHeader(`${hash}`);
  return number.toNumber();
};

export const finalizedHash = (api: ApiPromise) =>
  api.rpc.chain.getFinalizedHead();

export const getCouncilSize = async (api: ApiPromise): Promise<number> => {
  const councilSize: any = await api.query.councilElection.councilSize();
  return councilSize.toJSON() || 0;
}

export const getCouncilRound = async (api: ApiPromise): Promise<number> =>{
  const councilRound: any = await api.query.councilElection.round();
  return councilRound.toJSON() || 0;
}

export const getTermEndsAt = async (api: ApiPromise): Promise<number> => {
  const termsEndsAt: any = await api.query.council.termEndsAt();
  return termsEndsAt.toJSON() || 0;
}

export const getElectionStage = async (
  api: ApiPromise
): Promise</*{ [key: string]: Number }*/ any> =>
  (await api.query.councilElection.stage()).toHuman();

export const updateElection = async (api: ApiPromise) => {
  console.debug(`Updating election status`);
  const round = await getCouncilRound(api);
  const termEndsAt = await getTermEndsAt(api);
  const stage = await getElectionStage(api);
  let stageEndsAt: Number = 0;
  if (stage) {
    const key = Object.keys(stage)[0];
    stageEndsAt = stage[key];
  }

  const stages = [
    "announcingPeriod",
    "votingPeriod",
    "revealingPeriod",
    "newTermDuration",
  ];

  // Modified by mkblockchaindev
  let durations = await Promise.all(
    stages.map((s) => api.query.councilElection[s]())
  ).then((stages) => stages.map((stage) => /*stage.toJSON()*/ parseInt(stage.toString()) ));
  durations.push(durations.reduce((a, b) => a + b, 0));
  return { round, stageEndsAt, termEndsAt, stage, durations };
};

export const getCouncilApplicants = async (
  api: ApiPromise
): Promise<IApplicant[]> => {
  const addresses: AccountId[] = (
    await api.query.councilElection.applicants()
  ).toJSON() as unknown as AccountId[];
  const members = await Promise.all(
    addresses.map(async (address) => {
      return PromiseAllObj({
        address: address,
        memberId: await api.query.members.memberIdsByRootAccountId(
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
        member: (await api.query.members.membershipById(
          id
        )) as unknown as Member,
        electionStake: (
          await api.query.councilElection.applicantStakes(address)
        ).toJSON() as unknown as IElectionStake,
      } as IApplicant);
    })
  )) as IApplicant[];
};

export const getVotes = async (api: ApiPromise): Promise<IVote[]> => {
  const commitments: AccountId[] = (
    await api.query.councilElection.commitments()
  ).toJSON() as unknown as AccountId[];
  const votes = await Promise.all(
    commitments.map(async (hash) => {
      const vote = (await api.query.councilElection.votes(
        hash
      )) as unknown as SealedVote;
      const newStake = vote.stake.new;
      const transferredStake = vote.stake.transferred;
      const voterId = await api.query.members.memberIdsByRootAccountId(
        vote.voter
      );
      const voterMembership = (await api.query.members.membershipById(
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
        const voteId = await api.query.members.memberIdsByRootAccountId(
          candidateId
        );
        const voteMembership = (await api.query.members.membershipById(
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
};

const fromEntries = (xs: [string | number | symbol, any][]) =>
  xs.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const PromiseAllObj = (obj: {
  [k: string]: any;
}): Promise<{ [k: string]: any }> => {
  return Promise.all(
    Object.entries(obj).map(([key, val]) =>
      val instanceof Promise
        ? val.then((res) => [key, res])
        : new Promise((res) => res([key, val]))
    )
  ).then((res: any[]) => fromEntries(res));
};
