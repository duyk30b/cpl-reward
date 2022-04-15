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

    if (process.env.ENV == 'local') {
      req.userId = String(41449)
      next()
      return
    }

    if (xBceUid === null || xBceRole === null || xBceRole === 'guest') {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }

    let user = null
    user = await this.externalUserService.getUserInfo(xBceUid)
    if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }

    req.userId = String(xBceUid)
    next()
  }
}
