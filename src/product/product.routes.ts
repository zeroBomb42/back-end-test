import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

const router = Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// กำหนดเส้นทางให้ตรงตาม controller
router.get('/products', productController.getProducts.bind(productController));
router.get('/', productController.getProductForEdit.bind(productController));
router.post('/', productController.createProduct.bind(productController));
router.put('/', productController.updateProduct.bind(productController));
router.delete('/', productController.deleteProduct.bind(productController));
router.delete('/price', productController.deletePrice.bind(productController));

export default router;