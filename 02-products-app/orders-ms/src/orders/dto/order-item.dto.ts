import { Type } from 'class-transformer'
import { IsNumber, IsPositive } from 'class-validator'

export class OrderItemDto {
  @IsNumber()
  productId: number

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number
}
