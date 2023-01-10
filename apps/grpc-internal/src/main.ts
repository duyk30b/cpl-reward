import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { join } from 'path'
import { GrpcInternalModule } from './grpc-internal.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GrpcInternalModule,
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
          join(
            __dirname,
            '../grpc-internal/admin-campaign/admin-campaign.proto',
          ),
          join(__dirname, '../grpc-internal/admin-mission/admin-mission.proto'),
          join(__dirname, '../grpc-internal/admin-common/admin-common.proto'),
          join(__dirname, '../grpc-internal/health/health.proto'),
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
  logger.debug('===== REWARD: Service grpc-internal started =====')
}
bootstrap()
