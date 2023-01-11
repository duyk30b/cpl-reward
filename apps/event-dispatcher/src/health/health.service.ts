import { touchFile } from '@libs/utils'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus'

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)

  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async check() {
    const result = await this.health.check([])
    if (result.status === 'ok') {
      touchFile('/tmp/health')
    }
    try {
    } catch (e) {
      this.logger.error(e, e.stack)
    }
  }
}
