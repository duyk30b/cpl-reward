import { Module } from '@nestjs/common'
import { ExternalUserService } from './external-user.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'
import configuration from './configuration'
import { ExternalUserTagService } from './external-user-tag/external-user-tag.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    ExternalUserService,
    ExternalUserTagService,
    {
      provide: 'USER_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get('external_user.grpc_url'),
            package: ['user', 'user_tag'],
            protoPath: [
              join(process.cwd(), 'libs/external-user/src/user.proto'),
              join(process.cwd(), 'libs/external-user/src/user_tag.proto'),
            ],
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [ExternalUserService, ExternalUserTagService],
})
export class ExternalUserModule {}
