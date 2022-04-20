import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @GrpcMethod('Health', 'Check')
  async Check() {
    const result = await this.health.check([
      () =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
    ])
    if (result.status != 'ok') return { status: ServingStatus.NOT_SERVING }
    return { status: ServingStatus.SERVING }
  }
}
