import { Module } from '@nestjs/common'
import { C01Service } from './c01.service'
import { C01LocalListener } from './c01-local.listener'
import { C01InternalListener } from './c01-internal.listener'
import { MissionModule } from '@app/mission'
import { MissionUserModule } from '@app/mission-user'
import { MissionUserLogModule } from '@app/mission-user-log'
import { AffiliateInternalModule } from '@app/affiliate-internal'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    MissionModule,
    MissionUserModule,
    MissionUserLogModule,
    AffiliateInternalModule,
  ],
  providers: [
    C01Service,
    C01LocalListener,
    C01InternalListener,
    {
      provide: 'INTERNAL_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get('affiliate_internal.grpc_connection_url'),
            package: ['internal'], // ['internal', 'internal2']
            protoPath: join(
              process.cwd(),
              'libs/affiliate-internal/src/internal.proto',
            ),
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [C01Service],
})
export class C01Module {}
