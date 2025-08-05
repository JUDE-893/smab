import { Router } from 'express';
import { scrape } from '../controllers/scrapeController.js';

const router = Router();


router.post('/', scrape);

export default router; 