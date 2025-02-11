import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductService {
  private readonly prisma = new PrismaClient();

  async findProductsByNameAndPrice(name: string, price: number): Promise<any> {
    return this.prisma.product.findMany({
      where: {
        name: name ? { contains: name } : '',
        prices: {
          some: {
            amount: price ? { equals: price } : 0,
          },
        },
      },
    });
  }

  // เพิ่มเมธอดอื่นๆ ตามที่ต้องการ
}