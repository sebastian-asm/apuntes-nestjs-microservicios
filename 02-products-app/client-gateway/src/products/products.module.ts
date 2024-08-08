import { Module } from '@nestjs/common'

import { ProductsController } from './products.controller'
import { NatsModule } from 'src/nats/nats.module'

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [NatsModule]
})
export class ProductsModule {}
