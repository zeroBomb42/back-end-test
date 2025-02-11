import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductRepository {
  private prisma = new PrismaClient();

  // ดึงรายการ product โดยแสดงเฉพาะ id และ name
  async findProductsByNameAndPrice(name: string, price: number): Promise<any> {
    if (!name && !price) {
      return this.prisma.product.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true },
      });
    }

    return this.prisma.product.findMany({
      where: {
        isDeleted: false,
        ...(name ? { name: { contains: name } } : {}),
        ...(price ? { prices: { some: { isDeleted: false, amount: { equals: price } } } } : {}),
      },
      select: { id: true, name: true },
    });
  }

  async createProduct(data: any, userName: string): Promise<any> {
    // ตรวจสอบว่ามี product ที่มีชื่อซ้ำกันหรือไม่
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: data.name },
    });

    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        createdBy: userName,
        updatedBy: userName,
        prices: {
          create: data.prices.map(price => ({
            ...price,
            createdBy: userName,
            updatedBy: userName,
          })),
        },
      },
      include: { prices: true },
    });
  }

  async updateProduct(data: any, userName: string): Promise<any> {
    // อัปเดตราคาใหม่หรือเพิ่มราคาใหม่
    const updatePrices = data.prices.map(price => ({
      where: { id: price.id || 0 },
      create: { ...price, createdBy: userName, updatedBy: userName },
      update: { ...price, updatedBy: userName },
    }));

    return this.prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        updatedBy: userName,
        prices: {
          upsert: updatePrices,
        },
      },
      include: { prices: true },
    });
  }

  // ดึงข้อมูล product สำหรับแก้ไข (รวมรายละเอียดและราคาที่ยัง active)
  async getProductForEdit(productId: number): Promise<any> {
    return this.prisma.product.findUnique({
      where: { id: Number(productId), isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        prices: {
          select: {
            id: true,
            amount: true,
          },
          where: { isDeleted: false },
        },
      },
    });
  }

  async softDeletePrice(productId: number, priceId: number, userName: string): Promise<any> {
    const existingPrice = await this.prisma.price.findFirst({
      where: {
        id: priceId,
        productId: productId,
        isDeleted: false,
      },
    });
  
    if (!existingPrice) {
      throw new Error('Price not found');
    }
  
    return this.prisma.price.update({
      where: { id: priceId },
      data: { isDeleted: true, updatedBy: userName },
    });
  }

  async softDeleteProduct(productId: number, userName: string): Promise<any> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId, isDeleted: false },
    });
  
    if (!existingProduct) {
      throw new Error('Product not found');
    }
  
    return this.prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true, updatedBy: userName },
    });
  }
}