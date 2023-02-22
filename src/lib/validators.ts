import { ApiPromise } from "@polkadot/api";

// total reward per era
export const getLastReward = async (api: ApiPromise, era: number) =>
  Number(await api.query.staking.erasValidatorReward(era - 2));

// active validators
export const getValidators = async (api: ApiPromise) => {
  const validatorEntries = await api.query.session.validators();
  return validatorEntries.map((v: any) => String(v));
};

// validators including waiting
export const getStashes = async (api: ApiPromise) => {
  const stashes = await api.derive.staking.stashes();
  return stashes.map((s: any) => String(s));
};

export const getNominators = async (api: ApiPromise) => {
  const nominatorEntries = await api.query.staking.nominators.entries();
  return nominatorEntries.map((n: any) => String(n[0].toHuman()));
};

export const getValidatorStakes = async (
  api: ApiPromise,
  era: number,
  stashes: string[],
  members: Member[],
  save: (key: string, data: any) => {}
) => {
  console.log(`Updating stakes`);
  let stakes = {};
  for (const validator of stashes) {
    const prefs = await api.query.staking.erasValidatorPrefs(era, validator);
    const commission = Number(prefs.commission) / 10000000;

    const data = await api.query.staking.erasStakers(era, validator);
    let { total, own, others } = data.toJSON();

    others = others.map(({ who, value }) => {
      const member = members.find((m) => m.rootKey === String(who));
      return { who, value, member };
    });
    stakes[validator] = { total, own, others, commission };
    save(`stakes`, stakes);
  }
  return stakes;
};

export const getEraRewardPoints = async (api: ApiPromise, era: number) =>
  (await api.query.staking.erasRewardPoints(era)).toJSON();

export const findActiveValidators = async (
  api: ApiPromise,
  hash: Hash,
  searchPreviousBlocks: boolean
): Promise<AccountId[]> => {
  const block = await api.rpc.chain.getBlock(hash);

  let currentBlockNr = block.block.header.number.toNumber();
  let activeValidators;
  do {
    let currentHash = (await api.rpc.chain.getBlockHash(
      currentBlockNr
    )) as Hash;
    let allValidators = (await api.query.staking.snapshotValidators.at(
      currentHash
    )) as Option<Vec<AccountId>>;
    if (!allValidators.isEmpty) {
      let max = (
        await api.query.staking.validatorCount.at(currentHash)
      ).toNumber();
      activeValidators = Array.from(allValidators.unwrap()).slice(0, max);
    }

    if (searchPreviousBlocks) {
      --currentBlockNr;
    } else {
      ++currentBlockNr;
    }
  } while (activeValidators === undefined);
  return activeValidators;
};

export const getTotalStake = async (api: ApiPromise, era: number) =>
  api.query.staking.erasTotalStake(era);
