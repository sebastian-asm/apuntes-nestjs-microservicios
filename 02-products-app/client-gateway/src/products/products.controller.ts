import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { PRODUCTS_MS } from 'src/config'

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_MS) private readonly productsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() body: any) {
    return 'crear producto'
  }

  @Get()
  findAllProducts() {
    // send manda una petición y espera una respuesta
    return this.productsClient.send({ cmd: 'find_all_products' }, {})
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return 'buscar un producto'
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'eliminar producto'
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return 'actualizar producto'
  }
}
