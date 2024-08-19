import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'
import { envs } from './config'

async function bootstrap() {
  const logger = new Logger('PaymentsMS')
  const app = await NestFactory.create(AppModule, { rawBody: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  // configuración de ms híbrido (rest + nats)
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: { servers: envs.natsServers }
    },
    // https://docs.nestjs.com/faq/hybrid-application#sharing-configuration
    // permite aceptar configuraciones como pipes, guards, filters, etc
    { inheritAppConfig: true }
  )
  await app.startAllMicroservices()

  await app.listen(envs.port)
  logger.log(`👉 Payments MS running on port ${envs.port}`)
}
bootstrap()
