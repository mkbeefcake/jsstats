import { Nominations } from "@polkadot/types/interfaces";
import { Option } from "@polkadot/types/codec";
import { StorageKey } from "@polkadot/types/primitive";

// import { IElectionStake } from "@joystream/types/council";
// import { ProposalParameters, VotingResults } from "@joystream/types/proposals";


export interface Api {
  query: any;
  rpc: any;
  derive: any;
}

export interface ProposalVote {
  id: number;
  consulId: number;
  memberId: number;
  proposalId: number;
  proposal: { title: string };
  vote: string;
}

export interface CouncilVote {
  id: number;
  stake: number;
  memberId: number;
  member: { handle: string };
}

export interface Consul {
  consulId: number;
  councilRound: number;
  memberId: number;
  member: { handle: string };
  stake: number;
  voters: CouncilVote[];
  votes: ProposalVote[];
}

export interface Council {
  round: number;
  start?: number;
  end?: number;
  startDate?: string;
  endDate?: string;
  consuls?: Consul[];
  last: string;
}

export interface ElectionStage {
  durations: number[];
  stage: any;
  round: number;
  stageEndsAt: number;
  termEndsAt: number;
}

export interface IApplicant {
  member: Member;
  electionStake: IElectionStake;
}

export interface IElectionState {
  applicants: IApplicant[];
  votes: IVote[];
  councilSize: Number;
}

export interface IVote {
  voterHandle: string;
  voterId: Number;
  candidateHandle: string | undefined;
  candidateId: Number | undefined;
  newStake: Number;
  transferredStake: Number;
}

export interface Status {
  status: Seat[];
  members: number;
  proposalPosts: any;
  councilApplicants: IApplicant[];
  councilVotes: IVote[];
  now: number;
  block: Block;
  era: number;
  connecting: boolean;
  loading: string;
  council?: Council;
  election: ElectionStage;
  durations: number[];
  issued: number;
  price: number;
  proposals: number;
  channels: number;
  categories: number;
  threads: number;
  posts: number;
  lastReward: number;
  startTime: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface IState {
  assets: string[];
  connecting: boolean;
  loading: string;
  processingTasks: number;
  faq: FAQItem[];
  fetching: string;
  providers: any[];
  status: Status;
  blocks: Block[];
  nominators: string[];
  validators: string[];
  stashes: string[];
  councils: Seat[][];
  channels: Channel[];
  categories: Category[];
  proposals: ProposalDetail[];
  posts: Post[];
  threads: Thread[];
  domain: string;
  proposalPosts: any[];
  members: Member[];
  mints: { group: string; mintId: number; content: number }[];
  tokenomics?: Tokenomics;
  reports: { [key: string]: string };
  [key: string]: any;
  stars: { [key: string]: boolean };
  stakes?: { [key: string]: Stakes };
  rewardPoints: ErasRewardPoints;
  hideFooter: boolean;
  showStatus: boolean;
  editKpi: any; // TODO
  // getMember: (m: string | number) => Member;
  groups: RoleSpending[];
}

export interface RewardPoints {
  total: number;
  individual: { [account: string]: number };
}

export interface Stake {
  who: string;
  value: number;
}

export interface Stakes {
  total: number;
  own: number;
  others: Stake[];
  commission: number;
}

export interface Seat {
  member: string;
  handle?: string;
  id?: number;
  stake: number;
  backers: Backer[];
}

export interface Backer {
  member: string;
  stake: number;
}

export interface Council {
  round: number;
  last: string;
}

export interface Options {
  verbose: number;
  channel: boolean;
  council: boolean;
  forum: boolean;
  proposals: boolean;
}

export interface ProposalDetail {
  createdAt: number;
  finalizedAt: number;
  message: string;
  parameters: ProposalParameters;
  stage: any;
  result: string;
  executed?: { Executed: null } | { ExecutionFailed: { error: string } };
  id: number;
  title: string;
  description: any;
  votes: VotingResults;
  type: string;
  votesByAccount?: Vote[];
  author: string;
  authorId: number;
  detail?: any;
}

interface Vote {
  id: number;
  vote: String;
  member: { id: number; handle: string };
}

export type ProposalArray = number[];

export interface ProposalPost {
  threadId: number;
  text: string;
  id: number;
  handle?: string;
}

export interface Proposals {
  current: number;
  last: number;
  active: ProposalArray;
  executing: ProposalArray;
}

export interface Channel {
  id: number;
  handle: string;
  title: string;
  description: string;
  avatar: string;
  banner: string;
  content: string;
  ownerId: number;  
  accountId: string;
  publicationStatus: boolean;
  curation: string;
  createdAt: string;
  principal: number;
}

export interface Category {
  id: number;
  threadId: number;
  title: string;
  description: string;
  createdAt: number;
  deleted: boolean;
  archived: boolean;
  subcategories: number;
  unmoderatedThreads: number;
  moderatedThreads: number;
  position: number;
  moderatorId: string;
}

export interface Post {
  id: number;
  text: string;
  threadId: number;
  authorId: string;
  createdAt: { block: number; time: number };
  // patches
  nr_in_thread: number;
  current_text : string;
}

export interface Thread {
  id: number;
  title: string;
  categoryId: number;
  nrInCategory: number;
  moderation: string;
  createdAt: string;
  authorId: string;
}

export interface Member {
  rootKey: string;
  account: string;
  handle: string;
  id: number;
  registeredAt: number;
  about: string;
}

export interface Block {
  id: number;
  timestamp: number;
  duration: number;
}

export interface Summary {
  blocks: Block[];
  validators: number[];
  nominators: number[];
}

export type NominatorsEntries = [StorageKey, Option<Nominations>][];

export interface ProviderStatus {
  [propName: string]: boolean;
}

export interface DollarPoolChange {
  blockheight: number;
  blockTime: string;
  change: number;
  reason: string;
  issuance: number;
  valueAfter: number;
  rateAfter: number;
}

export interface Tokenomics {
  dollarPool: { size: number; replenishAmount: number };
  dollarPoolChanges: DollarPoolChange[];
  price: string;
  totalIssuance: string;
  validators: { total_stake: string };
  burns: Burn[];
  exchanges: Exchange[];
  extecutedBurnsAmount: number;
}

export interface Burn {
  amount: number;
  blockHeight: number;
  date: string; // "2020-09-21T11:07:54.000Z"
  logTime: string; //"2020-09-21T11:08:54.091Z"
}

export interface Exchange {
  amount: number;
  amountUSD: number;
  blockHeight: number;
  date: string; // "2020-09-21T11:07:48.000Z"
  logTime: string; // "2020-09-21T11:08:48.552Z"
  price: number; // 0.000053676219442924057
  recipient: string; //"5D5PhZQNJzcJXVBxwJxZcsutjKPqUPydrvpu6HeiBfMaeKQu"
  sender: string; // "5DACzSg65taZ2NRktUtzBjhLZr8H5T8rwNoZUng9gQV6ayqT"
  senderMemo: string; //"4Testing1337SendToBurnerAddressHopingItWorksOfc5D5PhZQNJzcJXVBxwJxZcsutjKPqUPydrvpu6HeiBfMaeKQu"
  status: string; // FINALIZED | PENDING
  xmrAddress: string; //"No address found"
}

export interface Event {
  text: string;
  date: number;
  category: {
    tag: string;
    color: string;
  };
  link: {
    url: string;
    text: string;
  };
}

export interface Transaction {
  id: number;
  block: number;
  from: string;
  to: string;
  amount: number;
}

export interface Burner {
  wallet: string;
  totalburned: number;
}

export interface Burner {
  wallet: string;
  totalburned: number;
}

export interface ValidatorApiResponse {
  pageSize: number;
  totalCount: number;
  startBlock: number;
  endBlock: number;
  startTime: string;
  endTime: string;
  startEra: number;
  endEra: number;
  totalBlocks: number;
  report: ValidatorReportLineItem[];
}

export interface ValidatorReportLineItem {
  id: number;
  stakeTotal: string;
  stakeOwn: string;
  points: number;
  rewards: number;
  commission: number;
  blocksCount: number;
}

export interface ErasRewardPoints {
  total: number;
  eraTotals: { [key: sting]: number };
  validators: { [key: sting]: number[] };
}

export interface CalendarGroup {
  id: number;
  title: string;
}

export interface RoleSpending {
  name: string;
  actors: number;
  earning: { joy: number; dollar: number };
  stake: { joy: number; dollar: number };
}

// KPI

export interface LeaderboardMember {
  id: number;
  handle: string;
  totalEarnedUsd: number;
  totalEarnedTjoy: number;
  timesElected: number;
  usdPerElection: number;
  tjoyPerElection: number;
}

export interface CouncilMember {
  id: number;
  handle: string;
  rewardUsd: 51;
  rewardTjoy: number;
}

export interface Kpi {
  kpi: number;
  totalPossibleRewardsUsd: 3525;
  councilMembers: CouncilMember[];
}

// ------ patches ----
export type ChannelId = number;
export type PostId = number;
export type ThreadId = number;
export type ProposalDetailsOf = any;
export type CategoryId = number;
export type MemberId = number;
export type Membership = any;
export type Proposal = any;
export type IElectionStake = any;
export type ProposalParameters = any;
export type VotingResults = any;
export type SealedVote = any;
export type Openings = any;
export interface Mint { group: string; mintId: number; content: number }
export type WorkerId = u64;
export type WorkerOf = any;
export type RewardRelationship = any;