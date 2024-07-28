import { Logger, ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { envs } from './config'

async function bootstrap() {
  const logger = new Logger('ProductMS')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { port: envs.port }
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen()
  logger.log(`✅ Products MS running on port ${envs.port}`)
}
bootstrap()
