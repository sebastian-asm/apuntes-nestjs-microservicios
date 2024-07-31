import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { CreateOrderDto } from './dto'

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

  findAll() {
    return `This action returns all orders`
  }

  findOne(id: number) {
    return `This action returns a #${id} order`
  }
}
