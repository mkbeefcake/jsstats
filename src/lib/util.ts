import { Options, Proposals, IApplicant, IVote } from "../types";
import moment from "moment";

export const parseArgs = (args: string[]): Options => {
  const inArgs = (term: string): boolean => {
    return args.find((a) => a.search(term) > -1) ? true : false;
  };

  const options: Options = {
    verbose: inArgs("--verbose") ? 2 : inArgs("--quiet") ? 0 : 1,
    channel: inArgs("--channel"),
    council: inArgs("--council"),
    forum: inArgs("--forum"),
    proposals: inArgs("--proposals"),
  };

  if (options.verbose > 1) console.debug("args", args, "\noptions", options);
  return options;
};

export const printStatus = (
  opts: Options,
  data: {
    block: number;
    cats: number[];
    chain: string;
    posts: number[];
    proposals: Proposals;
    threads: number[];
  }
): void => {
  if (opts.verbose < 1) return;

  const { block, chain, proposals, cats, posts, threads } = data;
  const date = formatTime();
  let message = `[${date}] Chain:${chain} Block:${block} `;

  if (opts.forum)
    message += `Post:${posts[1]} Cat:${cats[1]} Thread:${threads[1]} `;

  if (opts.proposals)
    message += `Proposals:${proposals.current} (Active:${proposals.active.length} Pending:${proposals.executing.length}) `;

  console.log(message);
};

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

// Validator data
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
