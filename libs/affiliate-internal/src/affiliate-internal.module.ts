import { Module } from '@nestjs/common'
import { AffiliateInternalService } from './affiliate-internal.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [AffiliateInternalService],
  exports: [AffiliateInternalService],
})
export class AffiliateInternalModule {}
