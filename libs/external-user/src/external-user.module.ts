import { Module } from '@nestjs/common'
import { ExternalUserService } from './external-user.service'

@Module({
  providers: [ExternalUserService],
  exports: [ExternalUserService],
})
export class ExternalUserModule {}
