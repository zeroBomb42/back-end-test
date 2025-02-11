import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findProductsByNameAndPrice(name: string, price: number): Promise<any> {
    return this.productRepository.findProductsByNameAndPrice(name, price);
  }

  async createProduct(data: any, userName: string): Promise<any> {
    return this.productRepository.createProduct(data, userName);
  }

  async updateProduct(data: any, userName: string): Promise<any> {
    return this.productRepository.updateProduct(data, userName);
  }

  async getProductForEdit(productId: number): Promise<any> {
    return this.productRepository.getProductForEdit(productId);
  }

  async softDeletePrice(productId: number, priceId: number, userName: string): Promise<any> {
    return this.productRepository.softDeletePrice(productId, priceId, userName);
  }

  async softDeleteProduct(productId: number, userName: string): Promise<any> {
    return this.productRepository.softDeleteProduct(productId, userName);
  }
}