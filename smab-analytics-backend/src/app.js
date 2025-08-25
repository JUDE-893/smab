import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './utils/logger.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
    logger.info('Health check endpoint called');
    res.json({ status: 'UP' });
});

export default app;
