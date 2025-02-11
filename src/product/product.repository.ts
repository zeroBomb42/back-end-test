import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<any> {
    return this.prisma.product.findMany();
  }

  // async create(): Promise<any> {
  //   return this.prisma.product.create();
  // }

  // async update(): Promise<any> {
  //   return this.prisma.product.update();
  // }

  // async delete(): Promise<any> {
  //   return this.prisma.product.delete();
  // }

  // เพิ่มเมธอดอื่นๆ ตามที่ต้องการ
}