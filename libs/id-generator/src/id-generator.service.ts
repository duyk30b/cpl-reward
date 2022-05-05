import { Injectable } from '@nestjs/common'
import * as moment from 'moment-timezone'

@Injectable()
export class IdGeneratorService {
  /**
   * Follow this url: https://docs.dev.staging-bitcastle.work/docs/global-guide/data_id/
   * @param orderType
   * @param userType
   * @param random
   * @param startTimeStr
   */
  generateId(
    orderType = 1,
    userType = 1,
    random = undefined,
    startTimeStr = undefined,
  ) {
    const startTime = moment
      .tz(startTimeStr === undefined ? '2021-01-01 00:00' : startTimeStr, 'GMT')
      .valueOf()
    const currentTime = moment().valueOf()
    const timeBInt = BigInt(currentTime) - BigInt(startTime)
    const userTypeBInt = BigInt(userType)
    const orderTypeBInt = BigInt(orderType)
    const randomBInt = BigInt(
      random === undefined ? this.getRandom(1, 4096) : random,
    )
    return (
      (timeBInt << 22n) |
      (userTypeBInt << 18n) |
      (orderTypeBInt << 12n) |
      (randomBInt << 0n)
    )
  }

  /**
   * Follow this url: https://en.wikipedia.org/wiki/Snowflake_ID
   */
  generateSnowflakeId(startPoint = '2022-01-01 00:00') {
    const startTime = moment.tz(startPoint, 'GMT').valueOf()
    const currentTime = moment().valueOf()
    const timeBInt = BigInt(currentTime) - BigInt(startTime)

    // 10 bit ~ 512 to 1023
    const instance = BigInt(this.getRandom(512, 1023))

    // 12 bit ~ 2048 to 4096
    const random = BigInt(this.getRandom(2048, 4096))

    return BigInt(
      '0b' + timeBInt.toString(2) + instance.toString(2) + random.toString(2),
    ).toString()
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
}
