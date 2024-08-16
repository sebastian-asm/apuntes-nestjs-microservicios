import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class PaymentSessionDto {
  @IsString()
  orderId: string

  @IsString()
  currency: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemDto)
  items: PaymentSessionItemDto[]
}

class PaymentSessionItemDto {
  @IsString()
  name: string

  @IsNumber()
  @IsPositive()
  price: number

  @IsNumber()
  @IsPositive()
  quantity: number
}
