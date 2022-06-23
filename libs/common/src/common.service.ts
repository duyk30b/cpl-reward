import { Injectable } from '@nestjs/common'
import { IPaginationLinks } from 'nestjs-typeorm-paginate'
import { BigNumber, FixedNumber } from 'ethers'
import { IGrantTarget } from './common.interface'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import * as Handlebars from 'handlebars'
import * as moment from 'moment-timezone'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'
import { Campaign } from '@lib/campaign/entities/campaign.entity'

@Injectable()
export class CommonService {
  getLogMessageFromTemplate(templateTxt: string, params: any) {
    const template = Handlebars.compile(templateTxt)
    return template(params)
  }

  getFixedReleaseValue(reward: RewardRule) {
    const releaseValue =
      reward.releaseValue === undefined ? '0' : reward.releaseValue

    return FixedNumber.fromString(String(releaseValue))
  }

  checkOnBudget(inputGrantTargets: any, inputRewardRules: any) {
    const grantTargets = inputGrantTargets as unknown as IGrantTarget[]
    const rewardRules = inputRewardRules as unknown as RewardRule[]

    const amountsByCurrency = {}
    for (const target of grantTargets) {
      if (
        amountsByCurrency[`${target.type}_${target.currency}`] === undefined
      ) {
        amountsByCurrency[`${target.type}_${target.currency}`] = '0'
      }
      const fixedAmount = FixedNumber.fromString(target.amount)
      amountsByCurrency[`${target.type}_${target.currency}`] =
        FixedNumber.fromString(
          amountsByCurrency[`${target.type}_${target.currency}`],
        )
          .addUnsafe(fixedAmount)
          .toString()
    }
    for (const reward of rewardRules) {
      const fixedLimit = FixedNumber.fromString(String(reward.limitValue))
      const fixedRelease = this.getFixedReleaseValue(reward)
      const amountByCurrency =
        amountsByCurrency[`${reward.key}_${reward.currency}`] === undefined
          ? '0'
          : amountsByCurrency[`${reward.key}_${reward.currency}`]
      if (amountByCurrency === '0') continue
      if (
        fixedLimit
          .subUnsafe(fixedRelease)
          .subUnsafe(FixedNumber.fromString(amountByCurrency))
          .toUnsafeFloat() < 0
      ) {
        return false
      }
    }
    return true
  }

  static compareNumberCondition(
    propertyValue: string,
    value: any,
    operator: string,
  ) {
    const bfPropertyVal = FixedNumber.fromString(propertyValue)
    const bfVal = FixedNumber.from(value)
    const bbPropertyVal = BigNumber.from(bfPropertyVal.toHexString())
    const bbVal = BigNumber.from(bfVal.toHexString())
    if (operator === '==') return bbVal.eq(bbPropertyVal)
    if (operator === '>') return bbVal.gt(bbPropertyVal)
    if (operator === '>=') return bbVal.gte(bbPropertyVal)
    if (operator === '<') return bbVal.lt(bbPropertyVal)
    if (operator === '<=') return bbVal.lte(bbPropertyVal)
    if (operator === '!=') return !bbVal.eq(bbPropertyVal)
    return false
  }

  static convertSnakeToCamelStr(input: string) {
    const STR = input
      .toLowerCase()
      .trim()
      .split(/[ -_]/g)
      .map((word) => word.replace(word[0], word[0].toString().toUpperCase()))
      .join('')
    return STR.replace(STR[0], STR[0].toLowerCase())
  }

  static customLinks(links: IPaginationLinks) {
    return {
      first: links.first,
      prev: links.previous,
      last: links.last,
      next: links.next,
    }
  }

  static randomItem(items) {
    return items[Math.floor(Math.random() * items.length)]
  }

  static currentUnixTime() {
    return moment().unix()
  }

  static hideEmail(email) {
    return email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
      for (let i = 0; i < gp3.length; i++) {
        gp2 += '*'
      }
      return gp2
    })
  }

  stripNull(object) {
    if (
      !object ||
      typeof object !== 'object' ||
      Array.isArray(object) ||
      object instanceof Date
    ) {
      return object
    }
    Object.entries(object).forEach(([key, value]) => {
      if (value == null) delete object[key]
      else object[key] = this.stripNull(value)
    })
    return object
  }

  checkValidCheckinTime(
    campaign: Campaign,
    checkInTime: number,
    lastReward: UserRewardHistory,
  ) {
    let lastRewardTime = campaign.startDate
    if (lastReward) {
      lastRewardTime = lastReward.createdAt
    } else {
      return checkInTime >= campaign.startDate
    }

    const currentTime = moment.unix(checkInTime)
    const currentHourMinute = currentTime.format('HH:mm')
    const [resetTimeHour, resetTimeMinute] = campaign.resetTime.split(':')
    const judgmentTime = moment
      .unix(checkInTime)
      .hours(parseInt(resetTimeHour))
      .minutes(parseInt(resetTimeMinute))

    if (currentHourMinute <= campaign.resetTime) {
      judgmentTime.subtract(1, 'day')
    }

    if (
      checkInTime >= judgmentTime.unix() &&
      lastRewardTime < judgmentTime.unix()
    ) {
      return true
    }

    return false
  }
}
