import { Module } from '@nestjs/common'

import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { NatsModule } from './nats/nats.module'

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [NatsModule]
})
export class PaymentsModule {}
