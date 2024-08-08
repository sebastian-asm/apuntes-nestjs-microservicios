import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

import { PaginationDto } from 'src/common'
import { NATS_SERVICE } from 'src/config'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto)
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    // send manda una petición y espera una respuesta
    return this.client.send({ cmd: 'find_all_products' }, paginationDto)
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    // alternativa 1
    try {
      return await firstValueFrom(this.client.send({ cmd: 'find_one_product' }, { id }))
    } catch (error) {
      throw new RpcException(error)
    }

    // alternativa 2
    // return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
    //   catchError((error) => {
    //     throw new RpcException(error)
    //   })
    // )
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.client.send({ cmd: 'delete_product' }, { id }))
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await firstValueFrom(this.client.send({ cmd: 'update_product' }, { id: +id, ...updateProductDto }))
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
