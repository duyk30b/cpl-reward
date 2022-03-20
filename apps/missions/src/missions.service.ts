import { IUser, JudgmentCondition, UserCondition } from './demo/demo.interface'
import { EVENTS } from '@lib/mission'
import { CommonService } from '@lib/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MissionsService {
  /**
   * @param judgmentConditions
   * @param messageValue
   */
  checkJudgmentConditions(
    judgmentConditions: JudgmentCondition[],
    messageValue: any,
  ) {
    if (judgmentConditions.length === 0) return true
    let result = false
    for (const idx in judgmentConditions) {
      const currentCondition = judgmentConditions[idx]
      if (currentCondition.eventName !== EVENTS.AUTH_USER_LOGIN) continue

      const checkExistMessageValue = messageValue[currentCondition.property]
      if (checkExistMessageValue === undefined) continue

      const checkJudgmentCondition = eval(`${CommonService.inspectStringNumber(
        messageValue[currentCondition.property],
      )}
            ${currentCondition.operator}
            ${CommonService.inspectStringNumber(currentCondition.value)}`)
      if (!checkJudgmentCondition) break
      result = true
    }
    return result
  }

  /**
   * @param userConditions
   * @param user
   */
  checkUserConditions(userConditions: UserCondition[], user: IUser) {
    if (userConditions.length === 0) return true
    let result = false
    for (const idx in userConditions) {
      const currentCondition = userConditions[idx]
      currentCondition.property = CommonService.convertSnakeToCamelStr(
        currentCondition.property,
      )

      const checkExistUserProperty = user[currentCondition.property]
      if (checkExistUserProperty === undefined) continue

      const checkUserCondition = eval(`${CommonService.inspectStringNumber(
        user[currentCondition.property],
      )}
            ${currentCondition.operator}
            ${CommonService.inspectStringNumber(currentCondition.value)}`)
      if (!checkUserCondition) break
      result = true
    }
    return result
  }
}
