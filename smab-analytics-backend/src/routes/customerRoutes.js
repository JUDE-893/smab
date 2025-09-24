import { Router } from 'express';
import { getCustomerMetrics, getCustomerAnalytics }
        from '../controllers/customerController.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';

const router = Router();

router.use(protect, verifiedAccess)

router.get('/', getCustomerMetrics);
router.get('/customer-analysis', getCustomerAnalytics);



export default router;
