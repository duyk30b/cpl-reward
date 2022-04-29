import { Injectable } from '@nestjs/common'
import * as moment from 'moment-timezone'

@Injectable()
export class IdGeneratorService {
  generateId(
    orderType = 1,
    userType = 1,
    random = undefined,
    startTimeStr = undefined,
  ) {
    const startTime = moment
      .tz(startTimeStr === undefined ? '2020-01-01 00:00' : startTimeStr, 'GMT')
      .valueOf()
    const currentTime = moment().valueOf()
    const timeBInt = BigInt(currentTime) - BigInt(startTime)
    const userTypeBInt = BigInt(userType)
    const orderTypeBInt = BigInt(orderType)
    const randomBInt = BigInt(
      random === undefined ? IdGeneratorService.getRandom(1, 4096) : random,
    )
    return (
      (timeBInt << 22n) |
      (userTypeBInt << 18n) |
      (orderTypeBInt << 12n) |
      (randomBInt << 0n)
    )
  }

  private static getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  getTimeFromId(id: bigint) {
    return (id & (4398046511103n << 22n)) >> 22n
  }

  getUserTypeFromId(id: bigint) {
    return (id & (15n << 18n)) >> 18n
  }

  getOrderTypeFromId(id: bigint) {
    return (id & (63n << 12n)) >> 12n
  }
}
