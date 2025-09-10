import { Router } from 'express';
import { getProductsQuantity, getProductsRevenue, getSalesProduct }
        from '../controllers/productController.js';

const router = Router();

router.get('/quantity', getProductsQuantity);
router.get('/revenue', getProductsRevenue);
router.get('/all', getSalesProduct);


export default router;
