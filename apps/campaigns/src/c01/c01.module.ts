import { Module } from '@nestjs/common'
import { C01Service } from './c01.service'
import { C01LocalListener } from './c01-local.listener'
import { C01InternalListener } from './c01-internal.listener'
import { CampaignModule } from '@app/campaign'
import { CampaignUserModule } from '@app/campaign-user'
import { CampaignUserLogModule } from '@app/campaign-user-log'
import { AffiliateInternalModule } from '@app/affiliate-internal'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    CampaignModule,
    CampaignUserModule,
    CampaignUserLogModule,
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
