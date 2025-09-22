import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './utils/logger.js';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit'
import orderRoutes from './routes/orderRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import authRoutes from './routes/authRoutes.js';

// DOMESTIC IP ADDRESSES (e.g; NextJs server, listening services ...)
const allowedIps = process.env.DOMESTIC_IP_ADDRESSES.split(',') || [];;

const proxiedIPs = process.env.PROXIED_IP_ADDRESSES.split(',') || []; // ip addresses that are using proxy network (e.g; Dashboard clients)

const app = express();

// PROTECT AGAINST FOREIGN IP ADDRESSES | Allow onlly domestic ip addresses from accessing our app
app.use((req, res, next) => {
  const clientIp = req.ip;
  const timestamp = new Date().toISOString();
  logger.info(`[REQUEST] ${timestamp} ${req.method} ${req.originalUrl} | ip ${clientIp}`);
  console.log(`[REQUEST] ${timestamp} ${req.method} ${req.originalUrl} | ip ${clientIp}`);
  if (!allowedIps.includes(clientIp)) {
    logger.info(`[REQUEST FORBIDEN] ip ${clientIp}`);
    console.log(`[REQUEST FORBIDEN] ip ${clientIp}`);
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// SECURITY HEADERS
app.use(helmet());

// CORS SETTINGS
const corsOptionsDelegate = (req, callback) => {
  // req.ip will be the real client IP if trust proxy is set correctly
  const clientIp = req.ip;

  if (allowedIps.includes(clientIp)) {
    // Allow this IP
    callback(null, { origin: true });
  } else {
    // Block this IP from CORS
    callback(null, { origin: false });
  }
};

app.use(cors(corsOptionsDelegate));
// app.use(cors());

// JSON PARSER
app.use(express.json());

// RATE LIMITTING
const limiter = rateLimit({
  windowMs: 90 * 60 * 1000, // 90 minutes
  max: 100,
  keyGenerator: (req) => {
    let ipToUse;

    if (proxiedIPs.includes(req.ip)) {
      const xff = req.headers['x-forwarded-for'];
      if (xff) {
        ipToUse = xff.split(',')[0].trim();
      } else {
        ipToUse = req.ip || req.socket.remoteAddress;
      }
    } else {
      ipToUse = req.ip || req.socket.remoteAddress;
    }

    // Wrap with ipKeyGenerator to handle IPv6 subnets safely
    return ipKeyGenerator(ipToUse);
  }
});

app.use(limiter);

app.get('/health', (req, res) => {
    logger.info('Health check endpoint called');
    res.json({ status: 'UP' });
});

app.use('/smab-analytics/api/auth', authRoutes);
app.use('/smab-analytics/api/orders', orderRoutes);
app.use('/smab-analytics/api/sales', salesRoutes);
app.use('/smab-analytics/api/product', productRoutes);
app.use('/smab-analytics/api/customers', customerRoutes);

export default app;
