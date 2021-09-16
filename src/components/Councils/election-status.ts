import { IApplicant, IElectionState, IVote } from "../../types";
import { JoyApi } from "../../joyApi";
import { PromiseAllObj } from "../ValidatorReport/utils";

const api = new JoyApi();

export async function getElectionStatus(): Promise<IElectionState> {
  await api.init;
  return (await PromiseAllObj({
    applicants: await api.getCouncilApplicants(),
    stage: await api.stage(),
    councilRound: await api.councilRound(),
    councilSize: await api.councilSize(),
    votes: await api.getVotes(),
  })) as IElectionState;
}

export const calculateOtherVotes = (votes: IVote[], applicant: IApplicant) =>
  votes
    .filter((v) => `${v.candidateHandle}` === `${applicant.member.handle}`)
    .reduce((othersStake: Number, vote: IVote) => {
      return (
        Number(othersStake) +
        Number(vote.newStake) +
        Number(vote.transferredStake)
      );
    }, 0);

export const formatJoy = (stake: number): String => {
  if (stake >= 1000000) {
    return `${(stake / 1000000).toFixed(4)} MJOY`;
  }

  if (stake >= 1000) {
    return `${(stake / 1000).toFixed(4)} kJOY`;
  }

  return `${stake} JOY`;
};