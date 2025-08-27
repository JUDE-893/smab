import { Router } from 'express';
import { getHeaderMetrics,
        getChartsAnalysis,
        getOrders,
        getSalesMetricsPerDay,
        getOrderMetricsPerDay,
        getAgentSales } 
        from '../controllers/salesControllers.js';

const router = Router();

router.get('/header-metrics', getHeaderMetrics);

router.get('/orders', getOrders);

router.get('/chart-analysis', getChartsAnalysis);
// refactured to :
router.get('/agent-sales', getAgentSales);
router.get('/order-metrics-per-day', getOrderMetricsPerDay);
router.get('/sales-metrics-per-day', getSalesMetricsPerDay);


export default router;