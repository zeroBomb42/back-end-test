import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

const router = Router();

const productRepository = new ProductRepository();
const productService = new ProductService();
const productController = new ProductController(productService);

router.get('/products', productController.getProducts.bind(productController));
// router.post('/product', productController.createProduct.bind(productController));
// router.put('/product/:id', productController.updateProduct.bind(productController));
// router.delete('/product/:id', productController.deleteProduct.bind(productController));

// Add other routes as needed

export default router;