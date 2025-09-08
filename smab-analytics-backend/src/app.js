import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './utils/logger.js';
import orderRoutes from './routes/orderRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware (exact format: [REQUEST] datetime METHOD PATH)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[REQUEST] ${timestamp} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (req, res) => {
    logger.info('Health check endpoint called');
    res.json({ status: 'UP' });
});

app.use('/smab-analytics/api/orders', orderRoutes);
app.use('/smab-analytics/api/sales', salesRoutes);
app.use('/smab-analytics/api/product', productRoutes);

export default app;
