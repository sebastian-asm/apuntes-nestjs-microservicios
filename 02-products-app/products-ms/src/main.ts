import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { envs } from './config'

async function bootstrap() {
  const logger = new Logger('ProductMS')
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(envs.port)
  logger.log(`✅ Running MS on port ${envs.port}`)
}
bootstrap()
