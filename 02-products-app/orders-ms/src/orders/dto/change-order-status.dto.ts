import { IsEnum, IsUUID } from 'class-validator'
import { OrderStatus } from '@prisma/client'

import { OrdersStatusList } from '../enum/order.enum'

export class ChangeOrderStatusDto {
  @IsUUID(4)
  id: string

  @IsEnum(OrdersStatusList, { message: `Possible status value are: ${OrdersStatusList}` })
  status: OrderStatus
}
