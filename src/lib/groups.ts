import moment from "moment";
import { Openings } from "./types";
import { Mint } from "@joystream/types/mint";

export const getMints = async (api: Api, ids: number[]): Promise<Mint[]> => {
  console.debug(`Fetching mints`);
  const getMint = (id: number) => api.query.minting.mints(id);
  const mints: Mint[] = [];
  await Promise.all(
    ids.map(async (id) => (mints[id] = (await getMint(id)).toJSON()))
  );
  return mints;
};

export const updateWorkers = async (
  api: ApiPromise,
  workers,
  members: Member[]
) => {
  const lastUpdate = workers?.timestamp;
  if (lastUpdate && moment() < moment(lastUpdate).add(1, `hour`))
    return workers;
  return {
    content: await getGroupWorkers(api, "contentDirectory", members),
    storage: await getGroupWorkers(api, "storage", members),
    operations: await getGroupWorkers(api, "operations", members),
    timestamp: moment().valueOf(),
  };
};

const getGroupWorkers = async (
  api: ApiPromise,
  wg: string,
  members: Member[]
) => {
  const group = wg + "WorkingGroup";
  let workers = [];
  const count = (
    (await api.query[group].nextWorkerId()) as WorkerId
  ).toNumber();
  const lead = await api.query[group].currentLead();
  console.debug(`Fetching ${count} ${wg} workers`);
  for (let id = 0; id < count; ++id) {
    const isLead = id === +lead;
    const worker: WorkerOf = await api.query[group].workerById(id);
    if (!worker.is_active) continue;
    const memberId = worker.member_id.toJSON();
    const member: Membership = members.find((m) => m.id === memberId);
    const handle = member?.handle;
    let stake: Stake;
    let reward: RewardRelationship;

    if (worker.role_stake_profile.isSome) {
      const roleStakeProfile = worker.role_stake_profile.unwrap();
      const stakeId = roleStakeProfile.stake_id;
      const { staking_status } = (
        await api.query.stake.stakes(stakeId)
      ).toJSON();
      stake = staking_status?.staked?.staked_amount;
    }

    if (worker.reward_relationship.isSome) {
      const rewardId = worker.reward_relationship.unwrap();
      reward = (
        await api.query.recurringRewards.rewardRelationships(rewardId)
      ).toJSON();
    }
    workers.push({
      id,
      memberId,
      handle,
      stake,
      reward,
      isLead,
    });
  }
  return workers;
};

export const updateOpenings = async (
  api: ApiPromise,
  outdated: any,
  members: Member[]
) => {
  const lastUpdate = outdated?.timestamp;
  if (lastUpdate && moment() < moment(lastUpdate).add(1, `hour`))
    return outdated;
  console.debug(`Updating openings`);

  // mapping: key = pioneer route, value: chain section
  const groups = {
    curators: "contentDirectory",
    storageProviders: "storage",
    operationsGroup: "operations",
  };
  let updated: Openings = {};
  await Promise.all(
    Object.keys(groups).map((group) =>
      updateGroupOpenings(api, groups[group], outdated[group], members).then(
        (openings) => (updated[group] = openings)
      )
    )
  );
  updated.timestamp = moment().valueOf();
  return updated;
};

export const updateGroupOpenings = async (
  api: ApiPromise,
  wg: string,
  outdated: Opening[],
  members: Member[]
) => {
  const group = wg + "WorkingGroup";
  const count = (
    (await api.query[group].nextOpeningId()) as OpeningId
  ).toNumber();
  console.debug(` - Fetching ${count} ${wg} openings`);

  const isActive = (opening: Opening) =>
    Object.keys(opening.stage["active"].stage)[0] === "acceptingApplications";

  let updated = [];
  for (let wgOpeningId = 0; wgOpeningId < count; ++wgOpeningId) {
    const old = outdated?.find((o) => o.wgOpeningId === wgOpeningId);
    if (old && !isActive(old)) {
      updated.push(old);
      continue;
    }
    const wgOpening: OpeningOf = (
      await api.query[group].openingById(wgOpeningId)
    ).toJSON();
    const ids = wgOpening.applications;
    const openingId = wgOpening.hiring_opening_id;
    const opening = (await api.query.hiring.openingById(openingId)).toJSON();
    updated.push({
      ...opening,
      openingId,
      wgOpeningId,
      type: Object.keys(wgOpening.opening_type)[0],
      applications: await getApplications(api, group, ids, members),
      policy: wgOpening.policy_commitment,
    });
  }
  console.debug(`${group} openings`, updated);
  return updated;
};

export const getApplications = (
  api: ApiPromise,
  group: string,
  ids: number[],
  members: Member[]
) => {
  return Promise.all(
    ids.map(async (wgApplicationId) => {
      const wgApplication: ApplicationOf = (
        await api.query[group].applicationById(wgApplicationId)
      ).toJSON();
      let application = {};
      application.account = wgApplication.role_account_id;
      application.openingId = +wgApplication.opening_id;
      application.memberId = +wgApplication.member_id;
      const member = members.find((m) => m.id === application.memberId);
      if (member) application.author = member.handle;
      application.id = +wgApplication.application_id;
      application.application = (
        await api.query.hiring.applicationById(application.id)
      ).toJSON();
      return application;
    })
  );
};
