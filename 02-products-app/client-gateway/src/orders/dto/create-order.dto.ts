import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

import { OrdersStatusList, OrderStatus } from '../enum/order.enum'

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  totalAmount: number

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  totalItems: number

  @IsEnum(OrdersStatusList, { message: `Possible status value are: ${OrdersStatusList}` })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING

  @IsBoolean()
  @IsOptional()
  paid: boolean = false
}
