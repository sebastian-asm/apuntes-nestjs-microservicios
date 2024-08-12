import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

import { CreateOrderDto, StatusDto } from './dto'
import { NATS_SERVICE } from 'src/config'
import { PaginationDto } from 'src/common'

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      return await firstValueFrom(this.client.send('findAllOrders', paginationDto))
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get(':status')
  findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    try {
      return this.client.send('findAllOrders', { ...paginationDto, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.client.send('findOneOrder', { id }))
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
