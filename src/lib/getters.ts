import { formatProposalMessage } from "./announcements";
import fetch from "node-fetch";

//types
import { Api, ProposalArray, ProposalDetail } from "../ptypes";
import {
  ChannelId,
  PostId,
  ProposalDetailsOf,
  ThreadId,
} from "../ptypes";
import { Category, CategoryId } from "../ptypes";
import { MemberId, Membership } from "../ptypes";
import { Proposal } from "../ptypes";
import { AccountId } from "@polkadot/types/interfaces";

// channel

export const currentChannelId = async (api: Api): Promise<number> => {
  const id: ChannelId = await api.query.contentWorkingGroup.nextChannelId();
  return id - 1;
};

// members

export const membership = async (
  api: Api,
  id: MemberId | number
): Promise<Membership> => {
  return await api.query.members.membershipById(id);
};

export const memberHandle = async (api: Api, id: MemberId): Promise<string> => {
  const member: Membership = await membership(api, id);
  return member.handle.toJSON();
};

export const memberIdByAccount = async (
  api: Api,
  account: AccountId | string
): Promise<MemberId | number> => {
  const ids = await api.query.members.memberIdsByRootAccountId(account);
  return ids.length ? ids[0] : 0;
};

export const memberHandleByAccount = async (
  api: Api,
  account: AccountId | string
): Promise<string> => {
  const id: MemberId = await api.query.members.memberIdsByRootAccountId(
    account
  );
  const handle: string = await memberHandle(api, id);
  return handle === "joystream_storage_member" ? "joystream" : handle;
};

// forum

export const categoryById = async (api: Api, id: number): Promise<Category> => {
  const category: Category = await api.query.forum.categoryById(id);
  return category;
};

export const currentPostId = async (api: Api): Promise<number> => {
  const postId: PostId = await api.query.forum.nextPostId();
  return postId - 1;
};

export const currentThreadId = async (api: Api): Promise<number> => {
  const threadId: ThreadId = await api.query.forum.nextThreadId();
  return threadId - 1;
};

export const currentCategoryId = async (api: Api): Promise<number> => {
  const categoryId: CategoryId = await api.query.forum.nextCategoryId();
  return categoryId - 1;
};

// proposals

export const proposalCount = async (api: Api): Promise<number> => {
  const proposalCount: any = await api.query.proposalsEngine.proposalCount();
  return proposalCount.toJSON() || 0;
};

export const activeProposalCount = async (api: Api): Promise<number> => {
  const proposalCount: number = await api.query.proposalsEngine.activeProposalCount();
  return proposalCount || 0;
};

export const pendingProposals = async (api: Api): Promise<ProposalArray> => {
  const pending: ProposalArray = await api.query.proposalsEngine.pendingExecutionProposalIds(
    await activeProposalCount(api)
  );
  //const pending: ProposalArray = pendingProposals.toJSON();
  if (pending.length) console.debug("pending proposals", pending);
  return pending;
};

export const activeProposals = async (api: Api): Promise<ProposalArray> => {
  const active: ProposalArray = await api.query.proposalsEngine.activeProposalIds(
    await activeProposalCount(api)
  );
  //const active: ProposalArray = result.toJSON();
  if (active.length) console.debug("active proposals", active);
  return active;
};

const getProposalType = async (api: Api, id: number): Promise<string> => {
  const details: ProposalDetailsOf = await api.query.proposalsCodex.proposalDetailsByProposalId(
    id
  );
  const [type]: string[] = Object.getOwnPropertyNames(details.toJSON());
  return type;
};

const isExecuted = (proposalStatus : any) => {
  if (!proposalStatus) return null
  if (proposalStatus.Approved) return proposalStatus.Approved.toJSON()
  return proposalStatus.toJSON()
}
export const proposalDetail = async (
  api: Api,
  id: number
): Promise<ProposalDetail> => {
  const proposal: Proposal = await api.query.proposalsEngine.proposals(id);
  const status: { [key: string]: any } = proposal.status;
  const stage: string = status.isActive ? "Active" : "Finalized";
  const { finalizedAt, proposalStatus } = status[`as${stage}`];
  const result: string = proposalStatus
    ? (proposalStatus.isApproved && "Approved") ||
      (proposalStatus.isCanceled && "Canceled") ||
      (proposalStatus.isExpired && "Expired") ||
      (proposalStatus.isRejected && "Rejected") ||
      (proposalStatus.isSlashed && "Slashed") ||
      (proposalStatus.isVetoed && "Vetoed")
    : "Pending";
  const executed = isExecuted(proposalStatus)
  const { description, parameters, proposerId, votingResults } = proposal;
  const author: string = await memberHandle(api, proposerId);
  const title: string = proposal.title.toString();
  const type: string = await getProposalType(api, id);
  // TODO catch ExecutionFailed
  const args: string[] = [String(id), title, type, stage, result, author];
  const message: string = formatProposalMessage(args);
  const createdAt: number = proposal.createdAt.toNumber();

  return {
    id,
    title,
    createdAt,
    finalizedAt,
    parameters,
    message,
    stage,
    result,
    executed,
    description,
    votes: votingResults,
    type,
    author,
    authorId: Number(proposerId)
  };
};

// storage providers
export const providerStatus = async (domain: string): Promise<boolean> => {
  try {
    const res = await fetch(`https://${domain}:5001/api/v0/version`);
    return res.status >= 400 ? false : true;
  } catch (e) {
    return false;
  }
};

export const nextOpeningId = async (api: Api): Promise<number> => {
  const id = await api.query.storageWorkingGroup.nextOpeningId();
  return id.toJSON();
};

export const nextWorkerId = async (api: Api): Promise<number> => {
  const id = await api.query.storageWorkingGroup.nextWorkerId();
  return id.toJSON();
};
