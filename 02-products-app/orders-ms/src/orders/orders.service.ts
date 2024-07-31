import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { PrismaClient } from '@prisma/client'

import { ChangeOrderStatusDto, CreateOrderDto, OrderPaginationDto } from './dto'

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersMS')

  async onModuleInit() {
    await this.$connect()
    this.logger.log('✅ Database connected')
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({ data: createOrderDto })
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page, limit, status } = orderPaginationDto
    const totalPages = await this.order.count({ where: { status } })
    return {
      totalPages,
      page,
      lastPage: Math.ceil(totalPages / limit),
      data: await this.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status }
      })
    }
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({ where: { id } })
    if (!order) throw new RpcException({ status: HttpStatus.NOT_FOUND, message: 'La orden no existe' })
    return order
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto
    const order = await this.findOne(id)
    if (order.status === status) return order
    return this.order.update({ where: { id }, data: { status } })
  }
}
