import { OrderStatus } from '@prisma/client'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator'

import { OrdersStatusList } from '../enum/order.enum'

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number

  @IsNumber()
  @IsPositive()
  totalItems: number

  @IsEnum(OrdersStatusList, { message: `Possible status value are: ${OrdersStatusList}` })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING

  @IsBoolean()
  @IsOptional()
  paid: boolean = false
}
