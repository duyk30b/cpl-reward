import { Module } from '@nestjs/common'
import { C01Service } from './c01.service'
import { C01VerifyModule } from './c01-verify/c01-verify.module'
import { C01GiveModule } from './c01-give/c01-give.module'
import { KafkaModule } from '@app/kafka'
import { CommonModule } from '@app/common'
import { CampaignUserModule } from '@app/campaign-user'

@Module({
  imports: [
    C01VerifyModule,
    C01GiveModule,
    CommonModule,
    KafkaModule,
    CampaignUserModule,
  ],
  providers: [C01Service],
})
export class C01Module {}
