import { Module } from '@nestjs/common'
import { ExternalUserService } from './external-user.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    ExternalUserService,
    {
      provide: 'USER_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get('external_user.grpc_url'),
            package: ['user'],
            protoPath: join(process.cwd(), 'libs/external-user/src/user.proto'),
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [ExternalUserService],
})
export class ExternalUserModule {}
