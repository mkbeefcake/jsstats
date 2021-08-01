import { ApiPromise, WsProvider } from '@polkadot/api'
import { types } from '@joystream/types'
import { AccountId, Hash } from '@polkadot/types/interfaces'
import { config } from 'dotenv'
import BN from 'bn.js'
import { Option, Vec } from '@polkadot/types'
import { wsLocation } from '../../config'

config()

export class JoyApi {
  endpoint: string
  isReady: Promise<ApiPromise>
  api!: ApiPromise

  constructor() {
    this.endpoint = wsLocation
    this.isReady = (async () =>
      await new ApiPromise({ provider: new WsProvider(wsLocation), types }).isReadyOrError)()
  }

  get init(): Promise<JoyApi> {
    return this.isReady.then((instance) => {
      this.api = instance
      return this
    })
  }

  async finalizedHash() {
    return this.api.rpc.chain.getFinalizedHead()
  }

  async finalizedBlockHeight() {
    const finalizedHash = await this.finalizedHash()
    const { number } = await this.api.rpc.chain.getHeader(`${finalizedHash}`)
    return number.toNumber()
  }

  async findActiveValidators(hash: Hash, searchPreviousBlocks: boolean): Promise<AccountId[]> {
    const block = await this.api.rpc.chain.getBlock(hash)

    let currentBlockNr = block.block.header.number.toNumber()
    let activeValidators
    do {
      let currentHash = (await this.api.rpc.chain.getBlockHash(currentBlockNr)) as Hash
      let allValidators = await this.api.query.staking.snapshotValidators.at(currentHash) as Option<Vec<AccountId>>
      if (!allValidators.isEmpty) {
        let max = (await this.api.query.staking.validatorCount.at(currentHash)).toNumber()
        activeValidators = Array.from(allValidators.unwrap()).slice(0, max)
      }

      if (searchPreviousBlocks) {
        --currentBlockNr
      } else {
        ++currentBlockNr
      }

    } while (activeValidators === undefined)
    return activeValidators
  }

  async validatorsData() {
    const validators = await this.api.query.session.validators()
    const era = await this.api.query.staking.currentEra()
    const totalStake = era.isSome ?
      await this.api.query.staking.erasTotalStake(era.unwrap())
      : new BN(0)

    return {
      count: validators.length,
      validators: validators.toJSON(),
      total_stake: totalStake.toNumber(),
    }
  }
}
