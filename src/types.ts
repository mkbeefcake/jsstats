import { ApiPromise } from "@polkadot/api";
import { MemberId } from "@joystream/types/members";
import {
  ProposalParameters,
  ProposalStatus,
  VotingResults,
} from "@joystream/types/proposals";
import { Nominations } from "@polkadot/types/interfaces";
import { Option } from "@polkadot/types/codec";
import { StorageKey } from "@polkadot/types/primitive";

export interface Api {
  query: any;
}

export interface IState {
  now: number;
  block: number;
  blocks: Block[];
  nominators: string[];
  validators: string[];
  loading: boolean;
  council: Seat[];
  channels: number[];
  proposals: ProposalDetail[];
  posts: number[];
  categories: number[];
  threads: Thread[];
  domain: string;
  proposalCount: number;
  proposalPosts: any[];
  handles: { [key: string]: string };
  tokenomics?: Tokenomics;
  reports: { [key: string]: string };
  [key: string]: any;
}

export type Seat = any;

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
  stage: string;
  result: string;
  exec: any;
  id: number;
  title: string;
  description: any;
  votes: VotingResults;
  type: string;
}

export type ProposalArray = number[];

export interface Proposals {
  current: number;
  last: number;
  active: ProposalArray;
  executing: ProposalArray;
}

export interface Member {
  id: MemberId;
  handle: string;
  url?: string;
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

export interface Thread {}
export interface Tokenomics {
  extecutedBurnsAmount: string;
  price: string;
  totalIssuance: string;
  validators: { total_stake: string };
}
