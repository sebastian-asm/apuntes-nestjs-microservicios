import { Injectable, NotFoundException } from '@nestjs/common'

import { v4 as uuid } from 'uuid'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private products: Product[] = []

  create(createProductDto: CreateProductDto) {
    const { name, description, price } = createProductDto
    const newProduct = new Product(uuid(), name, description, price)
    this.products.push(newProduct)
    return newProduct
  }

  findAll(): Product[] {
    return this.products
  }

  findOne(id: string): Product {
    const product = this.products.find((product) => product.id === id)
    if (!product) throw new NotFoundException(`Producto no encontrado`)
    return product
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { name, description, price } = updateProductDto
    const product = this.findOne(id)
    product.updateWith({ name, description, price })
    return product
  }

  remove(id: string): Product {
    const product = this.findOne(id)
    this.products = this.products.filter((product) => product.id !== id)
    return product
  }
}
