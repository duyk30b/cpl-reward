import { Module } from '@nestjs/common'
import { MysqlService } from './mysql.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import configuration from '@app/mysql/configuration'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.master.host'),
        port: configService.get('mysql.master.port'),
        username: configService.get('mysql.master.user'),
        password: configService.get('mysql.master.pass'),
        database: configService.get('mysql.master.db'),
        autoLoadEntities: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule {}
