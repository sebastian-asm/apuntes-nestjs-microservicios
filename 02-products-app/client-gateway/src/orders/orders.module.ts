import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { OrdersController } from './orders.controller'
import { envs, ORDERS_MS } from 'src/config'

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_MS,
        transport: Transport.TCP,
        options: {
          host: envs.ordersMSHost,
          port: envs.ordersMSPort
        }
      }
    ])
  ]
})
export class OrdersModule {}
