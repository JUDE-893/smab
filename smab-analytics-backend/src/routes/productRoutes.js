import { Router } from 'express';
import { getProductsQuantity }
        from '../controllers/productController.js';

const router = Router();

router.get('/quantity', getProductsQuantity);


export default router;
