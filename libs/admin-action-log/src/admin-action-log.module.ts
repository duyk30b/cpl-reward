import { Module } from '@nestjs/common'
import { AdminActionLogService } from './admin-action-log.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminActionLog } from '@lib/admin-action-log/entities/admin-action-log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AdminActionLog])],
  providers: [AdminActionLogService],
  exports: [AdminActionLogService],
})
export class AdminActionLogModule {}
