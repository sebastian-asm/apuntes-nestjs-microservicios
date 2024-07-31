import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto'

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @MessagePattern('findAllOrders')
  findAll() {
    return this.ordersService.findAll()
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id') id: number) {
    return this.ordersService.findOne(id)
  }

  // @MessagePattern('changeOrderStatus')
  // changeOrderStatus() {
  //   return 'change order status'
  // }
}
