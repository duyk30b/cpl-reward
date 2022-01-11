import { Expose } from 'class-transformer'

export class WorkerUpdateCampaignDto {
  @Expose()
  id: number

  @Expose({ name: 'released_reward' })
  releasedReward?: boolean

  @Expose({ name: 'released_money' })
  releasedMoney?: boolean

  @Expose({ name: 'prepend_data_done' })
  prependDataDone?: boolean
}
