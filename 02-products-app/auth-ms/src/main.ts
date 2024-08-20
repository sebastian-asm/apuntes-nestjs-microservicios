import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'
import { envs } from 'src/config'

async function bootstrap() {
  const logger = new Logger('AuthMS')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: { servers: envs.natsServers }
  })
  await app.listen()
  logger.log(`👉 Auth MS running on port ${envs.port}`)
}
bootstrap()
