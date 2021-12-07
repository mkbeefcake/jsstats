import { AccountId } from "@polkadot/types/interfaces";

export interface SeatData {
  accountId: AccountId;
  member: MemberData;
  ownStake: number;
  backersStake: number;
  jsgStake: number;
  totalStake: number;
  backers: BakerData[];
}

export interface MemberData {
  accountId: AccountId;
  handle: string;
  id: number;
}

export interface BakerData {
  member: MemberData;
  stake: number;
}

export interface CouncilRound {
  round: number;
  termEndsAt: number;
  seats: SeatData[];
}

export interface ICouncilRounds {
  rounds: CouncilRound[];
}
