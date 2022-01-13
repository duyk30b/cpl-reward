import { Module } from '@nestjs/common'
import { KafkaModule } from '@app/kafka'
import { CommonModule } from '@app/common'
import { CampaignUserModule } from '@app/campaign-user'
import { C01Module } from './c01/c01.module'

@Module({
  imports: [C01Module, CommonModule, KafkaModule, CampaignUserModule],
  providers: [],
})
export class CampaignsModule {}
