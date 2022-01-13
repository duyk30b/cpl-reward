import { Expose } from 'class-transformer'

export class CreateCampaignDto {
  @Expose()
  name: string

  @Expose()
  active: boolean

  @Expose()
  currency: string

  @Expose({ name: 'start_date' })
  startDate: number

  @Expose({ name: 'end_date' })
  endDate: number

  @Expose({ name: 'limit_user_reward' })
  limitUserReward: number

  @Expose({ name: 'limit_user_money' })
  limitUserMoney: number

  @Expose({ name: 'limit_system_reward' })
  limitSystemReward: number

  @Expose({ name: 'limit_system_money' })
  limitSystemMoney: number

  @Expose({ name: 'prepare_data_required' })
  prepareDataRequired: boolean
}
