import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserCheckinLog } from './entities/user-checkin-log.entity'
import { UserCheckinLogService } from './user-checkin-log.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserCheckinLog])],
  providers: [UserCheckinLogService],
  exports: [UserCheckinLogService],
})
export class UserCheckinLogModule {}
