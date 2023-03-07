// source: https://www.notion.so/joystream/8696f2d7557e4da6af5bde645db704cb

//const stateSubscription = `subscription	{stateSubscription {lastCompleteBlock,lastProcessedEvent,indexerHead,chainHead} }`;

export const councils = `query {  electedCouncils (limit:10000) { electedAtTime electedAtBlock endedAtBlock endedAtTime} }`;

export const elections = `query { electionRounds (limit:10000) { createdAt cycleId, candidates{ member {id handle} noteMetadata {bulletPoints description} votePower } castVotes {id,castBy,deletedAt,electionRoundId,stake,stakeLocked,voteFor {memberId}, voteForId} } }`;

export const members = `query { memberships (limit:10000) { createdAt id handle rootAccount controllerAccount channels {id} metadata {about name} roles { isLead isActive groupId application{id answers {question {question} answer}} stake stakeAccount missingRewardAmount} } }`;

export const proposals = `query { proposals (limit:10000) {createdAt id title creator {id} details {__typename} discussionThread {posts {id authorId text}} description votes {voterId voteKind}} }`;

export const releasedStakes = `query { stakeReleasedEvents (limit:10000) {inExtrinsic,inBlock,id,stakingAccount}}`;

export const electionStages = `query { councilStageUpdates (limit:10000) {id,createdAt,stage{__typename},changedAt,electedCouncilId,electionProblem} }`;

export const revealedVotes = `query { voteRevealedEvents (limit:10000) { createdAt inBlock,id,castVoteId,castVote{electionRoundId,stake,votePower,stakeLocked,commitment,voteForId,voteFor{id,memberId,votePower } } } }`;

export const candidateVotes = `query {
  candidates (limit:10000) { createdAt memberId status stake electionRound {cycleId} noteMetadata {bulletPoints bannerImageUri description} }
  voteCastEvents (limit:10000) { createdAt inBlock castVote{id,commitment,electionRound {cycleId} ,stake,stakeLocked,castBy,voteFor {memberId status} }}
}`;

export const forumCategories = `query {forumCategories (limit:10000) {id,createdAt,deletedAt,parentId,status{__typename}}}`;

export const bounties = `query { bounties (limit:10000) {
  id creator {id handle} stage isTerminated workPeriod judgingPeriod judgment { inBlock } cherry entrantStake totalFunding
  createdInEvent { inBlock } canceledEvent { inBlock } createdAt createdById updatedAt,updatedById
   discussionThreadId title description worksubmittedeventbounty { entryId inBlock createdAt description } } }`;

export const councilsElected = `query { newCouncilElectedEvents (limit:10000) { createdAt inBlock }}`;

export const councilSalaryPayouts = `query { rewardPaymentEvents (limit:10000) { createdAt inBlock paidBalance rewardAccount missingBalance } }`;

export const councilBudgetRefills = `query { budgetRefillEvents (limit:10000) { createdAt balance inBlock  } }`;

export const wgBudgetRefills = `query WG_BudgetUpdated { budgetUpdatedEvents (limit:10000) { createdAt group { name } budgetChangeAmount inBlock } }`;

export const videos = `query { videos (limit:100000) { createdAt id title createdInBlock channelId categoryId isCensored isExplicit isPublic } }`;

export const channels = `query { channels (limit:10000) { createdAt createdInBlock title id isPublic isCensored } }`;

export const workerPayouts = `query { rewardPaidEvents (limit: 10000) { createdAt inBlock amount worker { membership { handle } } } }`;

export const workerPayments = `query { rewardPaidEvents (limit: 10000) { createdAt inBlock amount groupId worker { membership{handle} rewardPerBlock missingRewardAmount } } }`;

export const councilSalaryChanges = `query { councilorRewardUpdatedEvents(limit: 9999) { createdAt inBlock rewardAmount } }`;

export const openings = `query {
  openingAddedEvents (limit: 10000) { createdAt inBlock groupId opening { id metadata {title shortDescription description applicationDetails applicationFormQuestions { index question }} } }
  openingFilledEvents (limit: 10000) { createdAt inBlock groupId openingId workersHired { rewardAccount rewardPerBlock membership { id handle} } }
  openingCanceledEvents (limit: 10000) { createdAt inBlock groupId openingId }
}`;

export const wgSpending = `query { budgetSpendingEvents (limit: 10000) { inBlock amount groupId rationale reciever }}`;

export const workerChanges = `query {
  workerRewardAmountUpdatedEvents (limit: 10000) { createdAt inBlock newRewardPerBlock groupId worker { id membership { id handle} } }
  stakeSlashedEvents (limit: 10000) { createdAt inBlock groupId slashedAmount worker { id membership { id handle} } }
  workerRoleAccountUpdatedEvents (limit: 10000) { createdAt inBlock workerId inExtrinsic groupId worker { membership { id handle} } }
  terminatedWorkerEvents (limit: 10000) { inBlock createdAt groupId rationale worker  { id membership { id handle}} }
  workerExitedEvents (limit: 10000) { createdAt inBlock groupId worker { id membership { id handle} } }
}`;

// name, lifetime hours, query string, active
const queries = [
  ["councils", 24, councils, true],
  ["elections", 24, elections, true],
  ["electionStages", 24, electionStages],
  ["councilsElected", 12, councilsElected, true],
  ["councilSalaryChanges", 24, councilSalaryChanges, true],
  ["councilSalaryPayouts", 24, councilSalaryPayouts, true],
  ["councilBudgetRefills", 24, councilBudgetRefills, true],
  ["wgBudgetRefills", 24, wgBudgetRefills, true],
  ["wgSpending", 24, wgSpending, true],
  ["workerPayouts", 24, workerPayouts],
  ["workerPayments", 24, workerPayments, true],
  ["workerChanges", 1, workerChanges, true],
  ["openings", 24, openings, true],
  ["proposals", 1, proposals, true],
  ["bounties", 24, bounties, true],
  ["members", 24, members, true],
  ["releasedStakes", 1, releasedStakes],
  ["revealedVotes", 24, revealedVotes],
  ["candidateVotes", 4, candidateVotes],
  ["forumCategories", 6, forumCategories, true],
  ["videos", 24, videos, true],
  ["channels", 24, channels, true],
];

export default queries;
