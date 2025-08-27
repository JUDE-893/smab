import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import logger from '../utils/logger.js';
import { format } from 'date-fns';
// import pool from '../config/db/mysql.js';
// import { mergeProducts } from '../utils/helpers.js';




export const getHeaderMetrics = errorCatchingLayer(async (req, res, next) => {
    
  const { timeRange } = req.query;
  
  const dates = timeRange.split(',');
  console.log('[timeRange]', timeRange, dates);

  

  return res.status(200).json({
      message: 'Order created successfully',timeRange,dates
  });
});




