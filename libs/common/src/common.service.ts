import { Injectable } from '@nestjs/common'
import { IPaginationLinks } from 'nestjs-typeorm-paginate'
import { BigNumber } from 'ethers'

@Injectable()
export class CommonService {
  static compareNumberCondition(
    propertyValue: string,
    value: number,
    operator: string,
  ) {
    const bPropertyVal = BigNumber.from(propertyValue)
    const bVal = BigNumber.from(value)
    if (operator === '==') return bVal.eq(bPropertyVal)
    if (operator === '>') return bVal.gt(bPropertyVal)
    if (operator === '>=') return bVal.gte(bPropertyVal)
    if (operator === '<') return bVal.lt(bPropertyVal)
    if (operator === '<=') return bVal.lte(bPropertyVal)
    return false
  }

  static inspectStringNumber(input: string | number, type: string) {
    if (type === 'string') return `'${input}'`
    if (type === 'number') return Number(input)
    return input
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
