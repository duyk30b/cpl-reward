import { Module } from '@nestjs/common'
import { AdminActionLogModule } from '@lib/admin-action-log'
import { AdminCommonController } from './admin-common.controller'
import { AdminCommonService } from './admin-common.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [AdminActionLogModule, ConfigModule],
  controllers: [AdminCommonController],
  providers: [AdminCommonService],
})
export class AdminCommonModule {}
