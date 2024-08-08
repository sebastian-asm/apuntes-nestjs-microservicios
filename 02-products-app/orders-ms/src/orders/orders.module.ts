import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { envs, PRODUCTS_MS } from 'src/config'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_MS,
        transport: Transport.TCP,
        options: {
          host: envs.productsMSHost,
          port: envs.productsMSPort
        }
      }
    ])
  ]
})
export class OrdersModule {}
