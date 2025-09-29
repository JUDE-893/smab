import { Router } from 'express';
import { getHeaderMetrics,
        getChartsAnalysis,
        getOrders,
        getSalesMetricsPerDay,
        getOrderMetricsPerDay,
        getAgentSales,
        getPlansMetrics,
        getSalesAgentAnalytics }
        from '../controllers/salesControllers.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';
import { restrictForIp }  from '../controllers/integrityController.js';

const router = Router();

router.use(restrictForIp)

router.use(protect, verifiedAccess)

router.get('/header-metrics', getHeaderMetrics);

router.get('/orders', getOrders);

router.get('/chart-analysis', getChartsAnalysis);
// refactured to :
router.get('/agent-sales', getAgentSales);
router.get('/order-metrics-per-day', getOrderMetricsPerDay);
router.get('/sales-metrics-per-day', getSalesMetricsPerDay);
router.get('/metrics-plans', getPlansMetrics);
router.get('/sales-agent-analytics', getSalesAgentAnalytics);


export default router;
