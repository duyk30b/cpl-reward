import { Injectable } from '@nestjs/common'
import { IPaginationLinks } from 'nestjs-typeorm-paginate'
import { BigNumber, FixedNumber } from 'ethers'
import { IGrantTarget } from './common.interface'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'

@Injectable()
export class CommonService {
  getFixedReleaseValue(reward: RewardRule) {
    const releaseValue =
      reward.releaseValue === undefined ? '0' : reward.releaseValue

    return FixedNumber.fromString(String(releaseValue))
  }

  checkOutOfBudget(inputGrantTargets: any, inputRewardRules: any) {
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
}
