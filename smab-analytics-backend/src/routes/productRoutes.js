import { Router } from 'express';
import { getProductsQuantity, getProductsRevenue, getSalesProduct, getProductAnalytics }
        from '../controllers/productController.js';

const router = Router();

router.get('/quantity', getProductsQuantity);
router.get('/revenue', getProductsRevenue);
router.get('/all', getSalesProduct);
router.get('/analytics', getProductAnalytics);


export default router;
