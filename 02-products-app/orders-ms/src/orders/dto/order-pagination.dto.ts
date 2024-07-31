import { IsEnum, IsOptional } from 'class-validator'
import { OrderStatus } from '@prisma/client'

import { OrdersStatusList } from '../enum/order.enum'
import { PaginationDto } from 'src/common'

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrdersStatusList, { message: `Possible status value are: ${OrdersStatusList}` })
  status: OrderStatus
}
