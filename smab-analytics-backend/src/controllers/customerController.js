import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import { ProductDetails } from '../models/productModel.js';
import MetricsPlans from '../models/metricsPlanModel.js';
import logger from '../utils/logger.js';
import { getDateRange } from '../utils/helpers.js';
import { format } from 'date-fns';
// import { log } from 'winston';


export const getCustomerMetrics = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  if (!timeRange) {
    return res.status(400).json({ message: 'timeRange query param is required. Expected format: date1,date2 (YYYY-MM-DD,YYYY-MM-DD)' });
  }

  const dates = String(timeRange).split(',').map((d) => d.trim());
  if (dates.length !== 2 || !dates[0] || !dates[1]) {
    return res.status(400).json({ message: 'Invalid timeRange. Expected two dates separated by a comma.' });
  }

  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  // Create aggregation pipeline
  const customerMetrics = await Order.aggregate([
    {
      $match: {
        orderDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $addFields: {
        // Convert prixttc from string to number
        numericPrixttc: {
          $convert: {
            input: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: { $ifNull: ['$prixttc', '0'] },
                    find: ',',
                    replacement: '.'
                  }
                },
                find: ' ',
                replacement: ''
              }
            },
            to: 'double',
            onError: 0,
            onNull: 0
          }
        },
        // Calculate total quantity of products in this order
        totalOrderQuantity: {
          $sum: '$products.quantity'
        }
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$customerName', 'Unknown'] },
        revenue: { $sum: '$numericPrixttc' },
        quantity: { $sum: '$totalOrderQuantity' },
        order_count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        customer_name: '$_id',
        revenue: 1,
        quantity: 1,
        order_count: 1
      }
    },
    {
      $sort: { revenue: -1 }
    }
  ]);

  return res.status(200).json({
    message: 'Customer metrics fetched successfully',
    data: customerMetrics
  });
});

export const getCustomerAnalytics = errorCatchingLayer(async (req, res, next) => {
  const { customerName, year } = req.query;

  if (!customerName) {
    return res.status(400).json({ message: 'customerName query param is required' });
  }

  // Set default to current year if not provided
  const targetYear = year ? parseInt(year) : new Date().getFullYear();
  
  // Create date range for the entire year
  const startDate = new Date(targetYear, 0, 1); // January 1st of the year
  const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999); // December 31st of the year

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  // Get orders for this customer in the date range
  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate },
    customerName: customerName
  }).lean();

  // Initialize monthly data structure
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthlyData = monthNames.map(month => ({
    month,
    quantity: 0,
    revenue: 0
  }));

  // Initialize daily orders data structure (will use a map for daily tracking)
  const dailyOrdersMap = new Map();

  // Initialize totals
  let totalRevenue = 0;
  let totalQuantity = 0;
  let totalOrders = orders.length;

  // Process each order
  orders.forEach(order => {
    // Convert prixttc to number
    const parsePrice = (value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const normalized = value
          .replace(/\s+/g, '')
          .replace(/,/g, '.');
        const num = parseFloat(normalized);
        return isNaN(num) ? 0 : num;
      }
      return 0;
    };

    const orderRevenue = parsePrice(order.prixttc);
    const orderQuantity = order.products.reduce((sum, p) => sum + p.quantity, 0);
    
    totalRevenue += orderRevenue;
    totalQuantity += orderQuantity;

    // Update monthly data
    const orderMonth = new Date(order.orderDate).getMonth();
    monthlyData[orderMonth].quantity += orderQuantity;
    monthlyData[orderMonth].revenue += orderRevenue;

    // Update daily orders data
    const orderDateStr = format(new Date(order.orderDate), 'yyyy-MM-dd');
    const currentCount = dailyOrdersMap.get(orderDateStr) || 0;
    dailyOrdersMap.set(orderDateStr, currentCount + 1);
  });

  // Convert daily orders map to array of objects
  const dailyOrders = Array.from(dailyOrdersMap.entries()).map(([date, order_count]) => ({
    date,
    order_count
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return res.status(200).json({
    message: 'Customer analytics fetched successfully',
    data: {
      customer_name: customerName,
      totalRevenue,
      totalOrders,
      totalQuantity,
      dailyOrders,
      monthlyAnalysis: monthlyData
    }
  });
});