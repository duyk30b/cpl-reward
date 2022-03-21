import { Injectable } from '@nestjs/common'
import { IPaginationLinks } from 'nestjs-typeorm-paginate'

@Injectable()
export class CommonService {
  static inspectStringNumber(input: string | number) {
    if (typeof input === 'string') return `'${input}'`
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
