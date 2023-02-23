import moment from "moment";
import { ApiPromise } from "@polkadot/api";
import { Openings } from "../ptypes";
import { Mint, Member, WorkerId, WorkerOf, RewardRelationship, 
  Membership, Stake, Opening, OpeningId, OpeningOf, ApplicationOf } from "../ptypes";

// mapping: key = pioneer route, value: chain section
export const groups = {
  curators: "contentWorkingGroup",
  storageProviders: "storageWorkingGroup",
  distribution: "distributionWorkingGroup",
  operationsGroupAlpha: "operationsWorkingGroupAlpha",
  operationsGroupBeta: "operationsWorkingGroupBeta",
  operationsGroupGamma: "operationsWorkingGroupGamma",
};

export const getMints = async (api: ApiPromise): Promise<[]> => {
  console.debug(`Fetching mints`);
  const getMint = (id: number) => api.query.minting.mints(id);
  const promises = Object.values(groups).map((group) =>
    api.query[group].mint().then((mintId) =>
      getMint(mintId).then((content) => {
        return { group, mintId: mintId.toNumber(), content };
      })
    )
  );
  return await Promise.all(promises);
};

export const updateWorkers = async (
  api: ApiPromise,
  workers,
  members: Member[]
) => {
  const lastUpdate = workers?.timestamp;
  if (
    lastUpdate &&
    Object.keys(workers).length > 1 &&
    moment() < moment(lastUpdate).add(1, `hour`)
  )
    return workers;

  console.log(`Fetching workers of ${Object.keys(groups).length} groups`);
  let updated: { [key: string]: any[] } = {};
  const promises = Object.values(groups).map((group: string) =>
    getGroupWorkers(api, group, members).then((w) => (updated[group] = w))
  );
  await Promise.all(promises);
  console.log(`Collected all workers`, updated);
  updated.timestamp = moment().valueOf();
  return updated;
};

const getGroupWorkers = async (
  api: ApiPromise,
  group: string,
  members: Member[]
) => {
  if (!api.query[group]) {
    console.debug(`getGroupWorkers: Skipping outdated group`, group);
    return [];
  }

  let workers = [];
  const count = (
    (await api.query[group].nextWorkerId()) as WorkerId
  ).toNumber();
  const lead = await api.query[group].currentLead();
  console.debug(` - Fetching ${count} ${group} workers`);
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
  outdated: { [key: string]: Opening[] },
  members: Member[]
) => {
  const lastUpdate = outdated?.timestamp;
  if (lastUpdate && moment() < moment(lastUpdate).add(1, `hour`))
    return outdated;
  console.debug(`Updating openings of ${Object.keys(groups).length} groups`);

  let updated: Openings = {};
  await Promise.all(
    Object.values(groups).map((group) =>
      updateGroupOpenings(api, group, outdated[group], members).then(
        (openings) => (updated[group] = openings)
      )
    )
  );
  updated.timestamp = moment().valueOf();
  return updated;
};

export const updateGroupOpenings = async (
  api: ApiPromise,
  group: string,
  outdated: Opening[],
  members: Member[]
) => {
  if (!api.query[group]) {
    console.debug(`updateGroupOpenings: Skipping outdated group`, group);
    return [];
  }
  const count = (
    (await api.query[group].nextOpeningId()) as OpeningId
  ).toNumber();
  console.debug(` - Fetching ${count} ${group} openings`);

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
  if (!api.query[group]) {
    console.debug(`getApplications: Skipping outdated group`, group);
    return [];
  }
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
