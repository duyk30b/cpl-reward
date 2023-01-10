import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { EventDispatcherModule } from './event-dispatcher.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(EventDispatcherModule)

  await app.listen(3000, () => {
    logger.debug('===== REWARD: Service event-dispatcher started =====')
  })
}
bootstrap()
