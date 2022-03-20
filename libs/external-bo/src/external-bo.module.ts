import { Module } from '@nestjs/common'
import { ExternalBoService } from './external-bo.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), HttpModule],
  providers: [ExternalBoService],
  exports: [ExternalBoService],
})
export class ExternalBoModule {}
