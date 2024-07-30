import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ProductsController } from './products.controller'
import { envs, PRODUCTS_MS } from 'src/config'

@Module({
  controllers: [ProductsController],
  providers: [],
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
export class ProductsModule {}
