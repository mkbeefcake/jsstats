import { Stakes, RewardPoints } from "../../types";

export const sortValidators = (
  field: string,
  validators: string[],
  stakes: Stakes,
  points: RewardPoints
) => {
  try {
    if (field === "points" || !stakes)
      return validators.sort((a, b) =>
        rewardPoints
          ? rewardPoints.individual[b] - rewardPoints.individual[a]
          : 0
      );

    if (field === "commission")
      return validators.sort((a, b) =>
        stakes[a] && stakes[b] ? stakes[a].commission - stakes[b].commission : 0
      );

    if (field === "ownStake")
      return validators.sort((a, b) =>
        stakes[a] && stakes[b] ? stakes[b].own - stakes[a].own : 0
      );

    if (field === "totalStake")
      return validators.sort((a, b) =>
        stakes[a] && stakes[b] ? stakes[b].total - stakes[a].total : 0
      );

    if (field === "othersStake") {
      const sumOf = (stakes: { value: number }[]) => {
        let sum = 0;
        stakes.forEach((s) => (sum += s.value));
        return sum;
      };

      return validators.sort((a, b) =>
        stakes[a] && stakes[b]
          ? sumOf(stakes[b].others) - sumOf(stakes[a].others)
          : 0
      );
    }
  } catch (e) {
    console.debug(`sorting failed`, e);
  }

  return validators;
};
