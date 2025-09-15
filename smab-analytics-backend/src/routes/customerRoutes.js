import { Router } from 'express';
import { getCustomerMetrics, getCustomerAnalytics }
        from '../controllers/customerController.js';

const router = Router();

router.get('/', getCustomerMetrics);
router.get('/customer-analysis', getCustomerAnalytics);



export default router;
