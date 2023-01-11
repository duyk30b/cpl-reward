import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthConsumerController } from './auth-consumer.controller'
import { AuthConsumerService } from './auth-consumer.service'

@Module({
  imports: [ConfigModule],
  controllers: [AuthConsumerController],
  providers: [AuthConsumerService],
})
export class AuthConsumerModule {}
