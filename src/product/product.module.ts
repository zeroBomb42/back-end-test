import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { createValidationMiddleware } from '../../common/middleware/validation.middleware';
import {
  getProductSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  deletePriceSchema,
} from './product.validation';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Validate query parameters for GET /product/products
    consumer
      .apply(createValidationMiddleware(getProductSchema, 'query'))
      .forRoutes({ path: 'product/products', method: RequestMethod.GET });

    // Validate body for POST /product
    consumer
      .apply(createValidationMiddleware(createProductSchema, 'body'))
      .forRoutes({ path: 'product', method: RequestMethod.POST });

    // Validate body for PUT /product
    consumer
      .apply(createValidationMiddleware(updateProductSchema, 'body'))
      .forRoutes({ path: 'product', method: RequestMethod.PUT });

    // Validate query for DELETE /product
    consumer
      .apply(createValidationMiddleware(deleteProductSchema, 'query'))
      .forRoutes({ path: 'product', method: RequestMethod.DELETE });

    // Validate query for DELETE /product/price
    consumer
      .apply(createValidationMiddleware(deletePriceSchema, 'query'))
      .forRoutes({ path: 'product/price', method: RequestMethod.DELETE });
  }
}