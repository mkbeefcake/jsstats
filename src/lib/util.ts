import { IApplicant, IVote } from "../types";
import moment from "moment";

export const mJoy = (mJoy: number) => (mJoy / 1000000).toFixed(2);

// time
export const formatDate = (time?: number) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

export const formatTime = (time?: any): string =>
  moment(time).format("H:mm:ss");

export const passedTime = (start: number, now: number): string =>
  formatTime(moment.utc(moment(now).diff(moment(start))));

export const exit = (log: (s: string) => void) => {
  log("\nNo connection, exiting.\n");
  process.exit();
};

// Election

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
