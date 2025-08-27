import { Router } from 'express';
import { createOrUpdateOrder } from '../controllers/orderControllers.js';

const router = Router();

router.post('/new', createOrUpdateOrder);

export default router;