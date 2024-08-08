import { IsNumber, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

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
