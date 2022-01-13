import { Module } from '@nestjs/common'
import { KafkaModule } from '@app/kafka'
import { CommonModule } from '@app/common'
import { CampaignUserModule } from '@app/campaign-user'
import { C01Module } from './c01/c01.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MysqlModule } from '@app/mysql'

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    KafkaModule,
    EventEmitterModule.forRoot(),
    C01Module,
  ],
  providers: [],
})
export class CampaignsModule {}
