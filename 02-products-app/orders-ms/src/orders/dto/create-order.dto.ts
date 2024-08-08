import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { OrderItemDto } from '.'

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  // validar los elementos internos del array
  @ValidateNested({ each: true })
  // cada iteración corresponde a un OrderItemDto
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}
