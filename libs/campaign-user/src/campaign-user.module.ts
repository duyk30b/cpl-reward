import { Module } from '@nestjs/common'
import { CampaignUserService } from './campaign-user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignUser } from '@app/campaign-user/entities/campaign-user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CampaignUser])],
  providers: [CampaignUserService],
  exports: [CampaignUserService],
})
export class CampaignUserModule {}
