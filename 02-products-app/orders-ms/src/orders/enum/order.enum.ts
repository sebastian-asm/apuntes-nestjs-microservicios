import { OrderStatus } from '@prisma/client'

export const OrdersStatusList = [OrderStatus.PENDING, OrderStatus.DELIVERED, OrderStatus.CANCELLED]
