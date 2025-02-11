import { Controller, Get, Post, Put, Delete, Body, Req, Res} from '@nestjs/common';
import { ProductService } from './product.service';
import { success, failed } from '../../common/config/response';
import { Request, Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET: ดึงรายการ product (แสดงเฉพาะ id และ name)
  @Get('products')
  async getProducts(@Req() req: Request, @Res() res: Response) {
    try {
      const { name, price } = req.query;
      const products = await this.productService.findProductsByNameAndPrice(
        name as string,
        Number(price)
      );
      return success(res, 'Get products success', products);
    } catch (error) {
      return failed(req, res, 'Get products failed', error);
    }
  }

  // GET: ดึงรายละเอียด product สำหรับแก้ไข (แสดงข้อมูลที่จำเป็น)
  @Get()
  async getProductForEdit(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.query;
      const product = await this.productService.getProductForEdit(Number(id));
      if (!product) {
        return success(res, 'Product not found');
      }
      return success(res, 'Product details fetched successfully', product);
    } catch (error) {
      return failed(req, res, 'Failed to fetch product details', error);
    }
  }

  // POST: สร้าง product พร้อมกับรายการราคา
  @Post()
  async createProduct(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const { userName } = req['user'] as { userName: string };
      const product = await this.productService.createProduct(body, userName);
      return success(res, 'Product created successfully');
    } catch (error) {
      return failed(req, res, `Create product failed: ${(error as Error).message ? (error as Error).message : error}`, error);
    }
  }

  // PUT: แก้ไข product (ต้องมี updatedBy ใน body)
  @Put()
  async updateProduct(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { userName } = req['user'] as { userName: string };
      const product = await this.productService.updateProduct(body, userName);
      return success(res, 'Product updated successfully');
    } catch (error) {
      return failed(req, res, 'Update product failed', error);
    }
  }

  // DELETE: Soft delete product (เปลี่ยน isDeleted เป็น true)
  @Delete()
  async deleteProduct(@Req() req: Request, @Res() res: Response) {
    try {
      const { productId } = req.query;
      const { userName } = req['user'] as { userName: string };
      const result = await this.productService.softDeleteProduct(Number(productId), userName);
      return success(res, 'Product deleted successfully');
    } catch (error) {
      return failed(req, res, `Delete product failed: ${(error as Error).message ? (error as Error).message : error}`, error);
    }
  }

  // DELETE: Soft delete ราคา product (เปลี่ยน isDeleted เป็น true)
  @Delete('price')
  async deletePrice(@Req() req: Request, @Res() res: Response) {
    try {
      const { userName } = req['user'] as { userName: string };
      const { priceId, productId } = req.query;
      const result = await this.productService.softDeletePrice( Number(productId), Number(priceId), userName);
      return success(res, 'Price deleted successfully');
    } catch (error) {
      return failed(req, res, `Delete price failed: ${(error as Error).message ? (error as Error).message : error}`, error);
    }
  }
}