import { Module } from '@nestjs/common'
import { AdminActionLogModule } from '@lib/admin-action-log'
import { AdminCommonController } from './admin-common.controller'
import { AdminCommonService } from './admin-common.service'

@Module({
  imports: [AdminActionLogModule],
  controllers: [AdminCommonController],
  providers: [AdminCommonService],
})
export class AdminCommonModule {}
