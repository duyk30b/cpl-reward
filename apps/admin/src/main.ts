import { NestFactory } from '@nestjs/core'
import { AdminModule } from './admin.module'
import { ConfigService } from '@nestjs/config'
import * as Sentry from '@sentry/node'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { join } from 'path'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AdminModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        package: [
          'admin_campaign',
          'admin_mission',
          'admin_common',
          'grpc.health.v1',
        ],
        protoPath: [
          join(__dirname, '../admin/admin-campaign/admin-campaign.proto'),
          join(__dirname, '../admin/admin-mission/admin-mission.proto'),
          join(__dirname, '../admin/admin-common/admin-common.proto'),
          join(__dirname, '../admin/health/health.proto'),
        ],
      },
    },
  )

  const configService = app.get(ConfigService)

  // Sentry
  const SENTRY_DSN = configService.get('common.sentry_dsn')
  Sentry.init({ dsn: SENTRY_DSN })
  app.useGlobalInterceptors(new SentryInterceptor())

  await app.listen()
}
bootstrap()
