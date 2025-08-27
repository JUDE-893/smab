import { Router } from 'express';
import { getHeaderMetrics } from '../controllers/salesControllers.js';

const router = Router();

router.get('/header-metrics', getHeaderMetrics);

export default router;