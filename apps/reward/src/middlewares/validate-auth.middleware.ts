import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { NextFunction } from 'express'
import { ExternalUserService } from '@lib/external-user'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'
import { ConfigService } from '@nestjs/config'
import { Environment } from '@lib/common'

@Injectable()
export class ValidateAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly externalUserService: ExternalUserService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: IRequestWithUserId, res: Response, next: NextFunction) {
    const xBceRole = req.header('X-BCE-ROLE') || null
    const xBceUid = req.header('X-BCE-UID') || null

    const ENV = this.configService.get<string>('common.env')
    if (ENV === Environment.Local) {
      req.userId = Number(xBceUid)
      next()
      return
    }
    let user = null
    if (xBceUid !== null)
      user = await this.externalUserService.getUserInfo(xBceUid)
    if (xBceRole === null || xBceRole === 'guest' || user === null) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }
    req.userId = Number(xBceUid)
    next()
  }
}
