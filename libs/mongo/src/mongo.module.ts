import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import db from 'config/db'
import { MongoService } from './mongo.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [db],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('missions.mongo.dsn'),
        database: 'kafka_shooter',
        entities: [],
        autoLoadEntities: true,
        synchronize: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
