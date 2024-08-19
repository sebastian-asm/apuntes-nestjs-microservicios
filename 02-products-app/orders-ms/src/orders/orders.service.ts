import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { PrismaClient } from '@prisma/client'
import { firstValueFrom } from 'rxjs'

import { ChangeOrderStatusDto, CreateOrderDto, OrderPaginationDto, PaidOrderDto } from './dto'
import { NATS_SERVICE } from 'src/config'
import { OrderWithProducts } from './interfaces'

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersMS')

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super()
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('✅ Database connected')
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productsIds = createOrderDto.items.map(({ productId }) => productId)
      const products: any[] = await firstValueFrom(this.client.send({ cmd: 'validate_products' }, productsIds))
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find((product) => product.id === orderItem.productId).price
        return acc + price * orderItem.quantity
      }, 0)
      const totalItems = createOrderDto.items.reduce((acc, orderItem) => acc + orderItem.quantity, 0)

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                productId: orderItem.productId,
                price: products.find((product) => product.id === orderItem.productId).price,
                quantity: orderItem.quantity
              }))
            }
          }
        },
        include: {
          OrderItem: {
            select: {
              productId: true,
              price: true,
              quantity: true
            }
          }
        }
      })

      return {
        ...order,
        OrderItem: order.OrderItem.map((item) => ({
          ...item,
          name: products.find((product) => product.id === item.productId).name
        }))
      }
    } catch (error) {
      throw new RpcException(error)
    }
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
    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            productId: true,
            price: true,
            quantity: true
          }
        }
      }
    })
    if (!order) throw new RpcException({ status: HttpStatus.NOT_FOUND, message: 'La orden no existe' })
    const productsIds = order.OrderItem.map(({ productId }) => productId)
    const products: any[] = await firstValueFrom(this.client.send({ cmd: 'validate_products' }, productsIds))
    return {
      ...order,
      OrderItem: order.OrderItem.map((item) => ({
        ...item,
        name: products.find((product) => product.id === item.productId).name
      }))
    }
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto
    const order = await this.findOne(id)
    if (order.status === status) return order
    return this.order.update({ where: { id }, data: { status } })
  }

  async createPaymentSession(order: OrderWithProducts) {
    return await firstValueFrom(
      this.client.send('create.payment.session', {
        orderId: order.id,
        currency: 'USD',
        items: order.OrderItem.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    )
  }

  async paidOrder(paidOrderDto: PaidOrderDto) {
    await this.order.update({
      where: { id: paidOrderDto.orderId },
      data: {
        status: 'PAID',
        paid: true,
        paidAt: new Date(),
        stripeChargeId: paidOrderDto.stripePaymentId,
        // relación uno a uno
        OrderReceipt: {
          create: { receiptUrl: paidOrderDto.receiptUrl }
        }
      }
    })
  }
}
