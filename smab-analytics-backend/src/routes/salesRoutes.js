import { Router } from 'express';
import { getHeaderMetrics,
        getChartsAnalysis,
        getOrders,
        getSalesMetricsPerDay,
        getOrderMetricsPerDay,
        getAgentSales,
        getPlansMetrics }
        from '../controllers/salesControllers.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';

const router = Router();

router.use(protect, verifiedAccess)

router.get('/header-metrics', getHeaderMetrics);

router.get('/orders', getOrders);

router.get('/chart-analysis', getChartsAnalysis);
// refactured to :
router.get('/agent-sales', getAgentSales);
router.get('/order-metrics-per-day', getOrderMetricsPerDay);
router.get('/sales-metrics-per-day', getSalesMetricsPerDay);
router.get('/metrics-plans', getPlansMetrics);


export default router;
