import { Module } from '@nestjs/common'
import { C01Service } from './c01.service'
import { C01LocalListener } from './c01-local.listener'
import { C01InternalListener } from './c01-internal.listener'
import { CampaignModule } from '@app/campaign'
import { CampaignUserModule } from '@app/campaign-user'
import { CampaignUserLogModule } from '@app/campaign-user-log'

@Module({
  imports: [CampaignModule, CampaignUserModule, CampaignUserLogModule],
  providers: [C01Service, C01LocalListener, C01InternalListener],
  exports: [C01Service],
})
export class C01Module {}
