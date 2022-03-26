import { Module } from '@nestjs/common'
import { CommonService } from './common.service'
import { ConfigModule } from '@nestjs/config'
import configuration from '@lib/common/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
