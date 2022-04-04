import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import db from 'config/db'
import { MongoService } from './mongo.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [db],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('debug.mongo.dsn'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
