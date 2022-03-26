import { Module } from '@nestjs/common'
import { UserRewardHistoryService } from './user-reward-history.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserRewardHistory])],
  providers: [UserRewardHistoryService],
  exports: [UserRewardHistoryService],
})
export class UserRewardHistoryModule {}
