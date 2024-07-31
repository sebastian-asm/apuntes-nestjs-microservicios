import { IsEnum, IsOptional } from 'class-validator'

import { OrdersStatusList, OrderStatus } from '../enum/order.enum'

export class StatusDto {
  @IsOptional()
  @IsEnum(OrdersStatusList, { message: `Possible status value are: ${OrdersStatusList}` })
  status: OrderStatus
}
