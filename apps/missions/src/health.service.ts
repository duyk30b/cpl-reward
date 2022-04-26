import { WriteData } from '@lib/common/storage.helper'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @Cron('*/30 * * * * *')
  async handleCron() {
    const fileName = `health`
    const result = await this.health.check([
      () =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
    ])

    if (result.status === 'ok') {
      const data = {
        ...result,
        time: new Date().getTime(),
      }
      await WriteData('/usr/src/app', fileName, JSON.stringify(data) + '\n')
    }

    if (result.status != 'ok') {
      process.emit('exit', 999)
    }
  }
}
