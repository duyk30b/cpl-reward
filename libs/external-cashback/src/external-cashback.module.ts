import { Module } from '@nestjs/common'
import { ExternalCashbackService } from './external-cashback.service'
import { ConfigModule } from '@nestjs/config'
import configuration from '../src/configuration'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), HttpModule],
  providers: [ExternalCashbackService],
  exports: [ExternalCashbackService],
})
export class ExternalCashbackModule {}
