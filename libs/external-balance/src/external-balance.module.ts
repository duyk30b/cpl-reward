import { Module } from '@nestjs/common'
import { ExternalBalanceService } from './external-balance.service'
import { ConfigModule } from '@nestjs/config'
import configuration from '@lib/external-balance/configuration'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), HttpModule],
  providers: [ExternalBalanceService],
  exports: [ExternalBalanceService],
})
export class ExternalBalanceModule {}
