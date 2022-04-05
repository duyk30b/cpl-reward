import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TRACE_CODES } from '@lib/campaign/trace-codes'
import { IWriteLog } from '../interfaces/missions.interface'
import { MissionsService } from '../missions.service'

@Injectable()
export class TraceListener {
  private readonly logger = new Logger(TraceListener.name)

  constructor(private readonly missionsService: MissionsService) {}

  @OnEvent('write_log')
  async traceLog(input: IWriteLog) {
    const msgId = input.data === undefined ? 'N/A' : input.data.msgId
    const msgName = input.data === undefined ? 'N/A' : input.data.msgName
    const msgDataJsonStr =
      input.data === undefined ? '{}' : JSON.stringify(input.data.msgData)
    const msgExtraDataJsonStr =
      input.extraData === undefined ? '{}' : JSON.stringify(input.extraData)

    const message =
      `[${msgId}] | [Name: ${msgName}] |` +
      ` [Message: ${
        TRACE_CODES[input.traceCode] === undefined
          ? this.missionsService.getLogMessageFromTemplate(
              input.traceCode,
              input.params,
            )
          : this.missionsService.getLogMessageFromTemplate(
              TRACE_CODES[input.traceCode],
              input.params === undefined ? {} : input.params,
            )
      }]. Data: ${msgDataJsonStr}. Extra Data: ${msgExtraDataJsonStr}`

    switch (input.logLevel) {
      case 'debug':
        this.logger.debug(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      case 'error':
        this.logger.error(message)
        break
      default:
        this.logger.log(message)
        break
    }
  }
}
