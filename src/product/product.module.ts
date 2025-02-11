import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { createValidationMiddleware } from '../../common/middleware/validation.middleware';
import { getProductSchema, createProductSchema, updateProductSchema } from './product.validation';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createValidationMiddleware(getProductSchema, 'query'))
      .forRoutes({ path: 'product/products', method: RequestMethod.GET });

    // consumer
    //   .apply(createValidationMiddleware(createProductSchema, 'body'))
    //   .forRoutes({ path: 'product', method: RequestMethod.POST });

    // consumer
    //   .apply(createValidationMiddleware(updateProductSchema, 'body'))
    //   .forRoutes({ path: 'product/:id', method: RequestMethod.PUT });
  }
}
