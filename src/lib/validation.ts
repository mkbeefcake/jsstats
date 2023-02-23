import { ApiPromise } from "@polkadot/api";

// get validator count
export const getCountForValidators = async (api: ApiPromise): Promise<number> =>{
	const count: any = await api.query.staking.counterForValidators();
	return count.toJSON() || 0;
}
  
// get minted value
export const getTotalMinted = async (api: ApiPromise): Promise<number> =>{
	const minted: any = await api.query.balances.totalIssuance();
	return minted.toJSON() || 0;
}

// get total stakes
export const getTotalStake = async (api: ApiPromise, era: number): Promise<number> => {
	const total: any = await api.query.staking.erasTotalStake(era);
	return total.toJSON() || 0;
}
