import { PartialType } from '@nestjs/mapped-types'

import { IsOptional, IsString, IsUUID } from 'class-validator'

import { CreateProductDto } from './create-product.dto'

// PartialType hace que todas las propiedades sean opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string
}
