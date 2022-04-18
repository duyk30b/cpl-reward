import { Injectable } from '@nestjs/common'
import { IPaginationLinks } from 'nestjs-typeorm-paginate'
import { BigNumber, FixedNumber } from 'ethers'

@Injectable()
export class CommonService {
  static compareNumberCondition(
    propertyValue: string,
    value: any,
    operator: string,
  ) {
    const bfPropertyVal = FixedNumber.fromString(propertyValue)
    const bfVal =
      typeof value === 'string'
        ? FixedNumber.from(value)
        : FixedNumber.fromString(value)
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
