import { Controller, Get, Req, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { success, failed } from '../../common/config/response';
import { Request, Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async getProducts(@Req() req: Request, @Res() res: Response) {
    try {
      const { name, price } = req.query;
      console.log(name, price);

      const products = await this.productService.findProductsByNameAndPrice(name as string, Number(price));

      return success(res, 'Get products success', products);
    } catch (error) {
      console.log('error 910001', error);
      return failed(req, res, 'Get products failed', error);
    }
  }
}