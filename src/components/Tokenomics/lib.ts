import { groups } from "../../lib/groups";

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

  let nonGroups = [
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
  ];
  if (council)
    nonGroups.push({
      id: "council",
      name: "Council members",
      actors: council?.length,
      earning: 0,
      stake: council?.reduce(
        (sum, { stake, backers }) =>
          sum + +stake + backers.reduce((s, voter) => s + +voter.stake, 0),
        0
      ),
    });
  return Object.values(groups).reduce(
    (updated: { [key: string]: any }, id: string) => {
      if (!workers[id] || !workers[id].length) return updated;
      const add = [
        {
          id,
          name: id,
          actors: workers[id].filter((w) => !w.isLead).length,
          earning: workerRewards(workers[id].filter((w) => !w.isLead)),
          stake: workerStakes(workers[id].filter((w) => !w.isLead)),
        },
        {
          id: id + "-lead",
          name: id + " lead",
          actors: 1,
          earning: leadReward(workers[id].find((w) => w.isLead)),
          stake: leadStake(workers[id].find((w) => w.isLead)),
        },
      ];
      return updated.concat(add);
    },
    nonGroups
  );
};
