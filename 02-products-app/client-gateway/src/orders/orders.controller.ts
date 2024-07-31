import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

import { CreateOrderDto, StatusDto } from './dto'
import { ORDERS_MS } from 'src/config'
import { PaginationDto } from 'src/common'

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDERS_MS) private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto)
  }

  @Get(':status')
  findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    try {
      return this.ordersClient.send('findAllOrders', { ...paginationDto, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.ordersClient.send('findOneOrder', { id }))
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      return this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
