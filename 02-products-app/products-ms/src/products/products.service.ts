import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDto } from 'src/common'

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductMS')

  onModuleInit() {
    this.$connect()
    this.logger.log('✅ Database connected')
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto })
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto
    const count = await this.product.count({ where: { available: true } })
    const lastPage = Math.ceil(count / limit)

    return {
      page,
      count,
      lastPage,
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { available: true }
      })
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({ where: { id, available: true } })
    if (!product) throw new NotFoundException('El producto no existe')
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id)
    return this.product.update({
      where: { id },
      data: updateProductDto
    })
  }

  // eliminación soft
  async remove(id: number) {
    await this.findOne(id)
    return this.product.update({
      where: { id },
      data: { available: false }
    })
  }

  // eliminación hard
  // async remove(id: number) {
  //   await this.findOne(id)
  //   return this.product.delete({ where: { id } })
  // }
}
