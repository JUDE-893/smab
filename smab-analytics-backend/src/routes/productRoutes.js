import { Router } from 'express';
import { getProductsQuantity, getProductsRevenue, getSalesProduct, getProductAnalytics }
        from '../controllers/productController.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';

const router = Router();

router.use(protect, verifiedAccess)

router.get('/quantity', getProductsQuantity);
router.get('/revenue', getProductsRevenue);
router.get('/all', getSalesProduct);
router.get('/analytics', getProductAnalytics);


export default router;
