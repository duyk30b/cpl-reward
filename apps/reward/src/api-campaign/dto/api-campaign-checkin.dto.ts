import { GRANT_TARGET_USER, WALLET } from '@lib/mission'
import { Exclude, Expose, Transform } from 'class-transformer'
import * as moment from 'moment'
import { TransformWalletMethod } from '../../api-mission/constant/mission'

export enum CHECKIN_MISSION_STATUS {
  COMPLETED = 1,
  CLAIMABLE = 2,
  DISABLED = 3,
}

export class CheckinCampaignDto {
  @Expose()
  id: number

  @Expose()
  title: string

  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose()
  description: string

  @Expose({ name: 'description_ja' })
  descriptionJa: string

  @Expose({ name: 'start_date' })
  startDate: number

  @Expose({ name: 'end_date' })
  endDate: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number

  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Expose({ name: 'notification_link_ja' })
  notificationLinkJa: string

  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Expose({ name: 'campaign_image_ja' })
  campaignImageJa: string

  @Expose()
  priority: number

  @Expose({ name: 'is_active' })
  isActive: number

  @Expose()
  status: number

  @Expose({ name: 'reset_time' })
  @Transform(
    ({ value }) => {
      if (!value) {
        return null
      }

      const [hours, minutes] = value.split(':')
      const resetTimestamp = moment()
        .utc()
        .hours(hours)
        .minutes(minutes)
        .seconds(0)

      if (moment().format('HH:mm') >= value) {
        resetTimestamp.add(1, 'd')
      }

      return resetTimestamp.unix()
    },
    { toPlainOnly: true },
  )
  resetTime: string

  @Expose({ name: 'should_show_popup' })
  shouldShowPopup = true

  get resetDisplayPreviousTime() {
    if (!this.resetTime) {
      return 0
    }

    const [hours, minutes] = this.resetTime.split(':')
    const resetTimestamp = moment()
      .utc()
      .hours(+hours)
      .minutes(+minutes)
      .seconds(0)

    if (moment().format('HH:mm') < this.resetTime) {
      resetTimestamp.subtract(1, 'd')
    }

    return resetTimestamp.unix()
  }
}

export class CheckinMissionDto {
  @Expose()
  id: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose()
  title: string

  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'detail_explain_ja' })
  detailExplainJa: string

  @Expose({ name: 'guide_link' })
  guideLink: string

  @Expose({ name: 'guide_link_ja' })
  guideLinkJa: string

  @Expose({ name: 'opening_date' })
  openingDate: number

  @Expose({ name: 'closing_date' })
  closingDate: number

  @Expose()
  priority: number

  @Exclude()
  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward: number

  @Exclude()
  @Expose({ name: 'is_active' })
  isActive: number

  @Expose({ name: 'claim_status' })
  claimStatus: number

  @Exclude()
  @Expose({ name: 'display_conditions' })
  displayConditions: string

  @Exclude()
  judgmentConditions: string

  @Exclude()
  completed: number

  @Exclude()
  @Expose()
  grantTarget: string

  @Expose()
  status: number

  // export from reward rule
  @Expose()
  currency() {
    const grantTargets = JSON.parse(this.grantTarget) as Array<GrantTargetDto>
    const mainTarget = grantTargets.find(
      (item) => item.user === GRANT_TARGET_USER.USER,
    )
    return mainTarget.currency
  }

  @Expose()
  amount() {
    const grantTargets = JSON.parse(this.grantTarget) as Array<GrantTargetDto>
    const mainTarget = grantTargets.find(
      (item) => item.user === GRANT_TARGET_USER.USER,
    )
    return mainTarget.amount
  }

  @Expose()
  wallet() {
    const grantTargets = JSON.parse(this.grantTarget) as Array<GrantTargetDto>
    const mainTarget = grantTargets.find(
      (item) => item.user === GRANT_TARGET_USER.USER,
    )

    const missionWalletMethod = TransformWalletMethod[mainTarget.wallet]
    if (missionWalletMethod) {
      return missionWalletMethod.wallet
    }

    return WALLET.BALANCE
  }

  @Exclude()
  @Expose({ name: 'success_count' })
  successCount: number | null
}

export class GrantTargetDto {
  @Expose()
  user: string

  @Expose()
  amount: number

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  type?: string
}
