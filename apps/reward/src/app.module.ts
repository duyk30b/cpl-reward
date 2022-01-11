import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiCampaignModule } from './campaign/api-campaign.module'

@Module({
  imports: [ApiCampaignModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
