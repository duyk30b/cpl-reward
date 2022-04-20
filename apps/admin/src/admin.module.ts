import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { MysqlModule } from '@lib/mysql'
import { AdminCampaignModule } from './admin-campaign/admin-campaign.module'
import { AdminMissionModule } from './admin-mission/admin-mission.module'
import { AdminCommonModule } from './admin-common/admin-common.module'
import { UserRewardHistoryModule } from '@lib/user-reward-history'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import dbConfigure from 'config/db'
import { InternationalPrice } from '@lib/international-price/entities/international-price.entity'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    MysqlModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [dbConfigure] })],
      name: 'bce',
      useFactory: (configService: ConfigService) => ({
        name: 'bce',
        type: 'mysql',
        host: configService.get('reward.mysql.bce.host'),
        port: configService.get('reward.mysql.bce.port'),
        username: configService.get('reward.mysql.bce.user'),
        password: configService.get('reward.mysql.bce.pass'),
        database: configService.get('reward.mysql.bce.db'),
        entities: [InternationalPrice],
      }),
      inject: [ConfigService],
    }),
    AdminCampaignModule,
    AdminMissionModule,
    AdminCommonModule,
    UserRewardHistoryModule,
    ScheduleModule.forRoot(),
    HealthModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
