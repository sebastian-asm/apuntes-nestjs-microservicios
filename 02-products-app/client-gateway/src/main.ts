import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { envs } from './config'
import { ExceptionFilter } from './common'

async function bootstrap() {
  const logger = new Logger('ClientGateway')
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new ExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(envs.port)
  logger.log(`👉 Client Gateway running on port ${envs.port}`)
}
bootstrap()
