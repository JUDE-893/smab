import logger from '../utils/logger.js';
import { errorCatchingLayer } from '../utils/helpers.js';

// PROTECT AGAINST FOREIGN IP ADDRESSES | Allow onlly domestic ip addresses from accessing our app
export const restrictForIp = errorCatchingLayer(async(req, res, next) => {

  // DOMESTIC IP ADDRESSES (e.g; NextJs server, listening services ...)
  const allowedIps = process.env.DOMESTIC_IP_ADDRESSES.split(',') || [];

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

