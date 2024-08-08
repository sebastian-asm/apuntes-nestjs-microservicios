import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { RpcException } from '@nestjs/microservices'

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
    // RpcException permite capturar el error desde el gateway
    if (!product)
      throw new RpcException({
        message: 'El producto no existe',
        status: HttpStatus.BAD_REQUEST
      })
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto
    await this.findOne(id)
    return this.product.update({
      where: { id },
      data
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

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids))
    const products = await this.product.findMany({ where: { id: { in: ids } } })
    if (products.length !== ids.length)
      throw new RpcException({
        message: 'Algunos productos no fueron encontrados',
        status: HttpStatus.BAD_REQUEST
      })
    return products
  }
}
