import { ApiPromise } from "@polkadot/api";
import { MemberId } from "@joystream/types/members";
import {
  ProposalParameters,
  ProposalStatus,
  VotingResults,
} from "@joystream/types/proposals";
import { AccountId, Nominations } from "@polkadot/types/interfaces";
import { Option } from "@polkadot/types/codec";
import { StorageKey } from "@polkadot/types/primitive";

export interface Api {
  query: any;
  rpc: any;
  derive: any;
}

export interface IState {
  //gethandle: (account: AccountId | string)  => string;
  connecting: boolean;
  now: number;
  era:number;
  block: number;
  blocks: Block[];
  nominators: string[];
  validators: string[];
  stashes: string[];
  loading: boolean;
  councils: Seat[][];
  councilElection?: { stage: any; round: number; termEndsAt: number };
  channels: Channel[];
  categories: Category[];
  issued: number;
  price: number;
  proposals: ProposalDetail[];
  posts: Post[];
  threads: Thread[];
  domain: string;
  proposalCount: number;
  proposalPosts: any[];
  handles: Handles;
  members: Member[];
  tokenomics?: Tokenomics;
  reports: { [key: string]: string };
  [key: string]: any;
  stars: { [key: string]: boolean };
  stakes?: { [key: string]: Stakes };
  rewardPoints?: RewardPoints;
  lastReward: number;
  hideFooter: boolean;
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
  exec: any;
  id: number;
  title: string;
  description: any;
  votes: VotingResults;
  type: string;
  votesByAccount?: Vote[];
  author: string;
  authorId: number;
  detail? : any
}

export interface Vote {
  vote: string;
  handle: string;
}

export type ProposalArray = number[];

export interface ProposalPost {
  threadId: number;
  text: string;
  id: number;
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

export interface Handles {
  [key: string]: string;
}

export interface Tokenomics {
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

export interface CalendarItem {
  id: number;
  group: number;
  title: string;
  start_time: number;
  end_time: number;
}

export interface CalendarGroup {
  id: number;
  title: string;
}
