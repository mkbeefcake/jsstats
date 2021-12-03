export const groupsMinting = (council, workers, validators) => {
  if (!council || !workers || !validators) return [];

  const termReward = (reward): number =>
    reward
      ? reward.payout_interval
        ? (+reward.amount_per_payout / +reward.payout_interval) * 600 * 24 * 7
        : +reward.amount_per_payout * 4 * 7
      : 0;

  const workerRewards = (workers: []): number =>
    workers.reduce((sum, { reward }) => sum + termReward(reward), 0);
  const workerStakes = (workers: []): number =>
    workers.reduce((sum, { stake }) => sum + (stake || 0), 0);
  const leadReward = ({ reward }): number => termReward(reward);
  const leadStake = ({ stake }): number => stake || 0;

  const groups = [
    {
      id: "validators",
      name: "Validators & Nominators",
      actors: validators.count,
      earning: validators.reward * 24 * 7,
      stake: Object.keys(validators.stakes).reduce(
        (sum, key) => sum + +validators.stakes[key].total,
        0
      ),
    },
    {
      id: "council",
      name: "Council members",
      actors: council?.length,
      earning: 0,
      stake: council?.reduce(
        (sum, { stake, backers }) =>
          sum + +stake + backers.reduce((s, voter) => s + +voter.stake, 0),
        0
      ),
    },
    {
      id: "storage",
      name: "Storage Providers",
      actors: workers.storage.filter((w) => !w.isLead).length,
      earning: workerRewards(workers.storage.filter((w) => !w.isLead)),
      stake: workerStakes(workers.storage.filter((w) => !w.isLead)),
    },
    {
      id: "storage-lead",
      name: "Storage lead",
      actors: 1,
      earning: leadReward(workers.storage.find((w) => w.isLead)),
      stake: leadStake(workers.storage.find((w) => w.isLead)),
    },
    {
      id: "curators",
      name: "Content Curators",
      actors: workers.content.filter((w) => !w.isLead).length,
      earning: workerRewards(workers.content.filter((w) => !w.isLead)),
      stake: workerStakes(workers.content.filter((w) => !w.isLead)),
    },
    {
      id: "curators-lead",
      name: "Curators lead",
      actors: 1,
      earning: leadReward(workers.content.find((w) => w.isLead)),
      stake: leadStake(workers.content.find((w) => w.isLead)),
    },
    {
      id: "operations",
      name: "Operations",
      actors: workers.operations.filter((w) => !w.isLead).length,
      earning: workerRewards(workers.operations.filter((w) => !w.isLead)),
      stake: workerStakes(workers.operations.filter((w) => !w.isLead)),
    },
    {
      id: "operations-lead",
      name: "Operations lead",
      actors: 1,
      earning: leadReward(workers.operations.find((w) => w.isLead)),
      stake: leadStake(workers.operations.find((w) => w.isLead)),
    },
  ];
  //this.save("groups", groups);
  return groups;
};
