import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { NextFunction } from 'express'
import { ExternalUserService } from '@lib/external-user'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'

@Injectable()
export class ValidateAuthMiddleware implements NestMiddleware {
  constructor(private readonly externalUserService: ExternalUserService) {}

  async use(req: IRequestWithUserId, res: Response, next: NextFunction) {
    const xBceRole = req.header('X-BCE-ROLE') || null
    const xBceUid = req.header('X-BCE-UID') || null

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
