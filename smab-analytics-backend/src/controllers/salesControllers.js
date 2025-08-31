import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import MetricsPlans from '../models/metricsPlanModel.js';
import logger from '../utils/logger.js';
import { getDateRange } from '../utils/helpers.js';
import { format } from 'date-fns';

// import pool from '../config/db/mysql.js';
// import { mergeProducts } from '../utils/helpers.js';




export const getHeaderMetrics = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  if (!timeRange) {
    return res.status(400).json({ message: 'timeRange query param is required. Expected format: date1,date2 (YYYY-MM-DD,YYYY-MM-DD)' });
  }

  const dates = String(timeRange).split(',').map((d) => d.trim());
  if (dates.length !== 2 || !dates[0] || !dates[1]) {
    return res.status(400).json({ message: 'Invalid timeRange. Expected two dates separated by a comma.' });
  }

  // Create inclusive day range in UTC
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate }
  }).lean();

  // Aggregate orders per salesAgent within the same date range
  const ordersPerAgent = await Order.aggregate([
    { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: { $ifNull: ['$salesAgent', 'Unknown'] }, orders: { $sum: 1 } } },
    { $project: { _id: 0, salesAgent: '$_id', orders: 1 } },
    { $sort: { orders: -1, salesAgent: 1 } }
  ]);

  const totalOrdersAcrossAgents = ordersPerAgent.reduce((sum, a) => sum + a.orders, 0);
  const agentCount = ordersPerAgent.length;
  const avgOrdersPerAgent = agentCount ? totalOrdersAcrossAgents / agentCount : 0;

  // Compute total sales (sum of prixttc) and best selling agent from fetched orders
  const parsePrice = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const normalized = value
        .replace(/\s+/g, '') // remove spaces
        .replace(/,/g, '.'); // convert comma decimal to dot
      const num = parseFloat(normalized);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  let totalSales = 0;
  const salesByAgent = new Map(); // salesAgent => totalSales

  for (const order of orders) {
    const price = parsePrice(order?.prixttc);
    totalSales += price;
    const agent = order?.salesAgent ?? 'Unknown';
    const current = salesByAgent.get(agent) ?? 0;
    salesByAgent.set(agent, current + price);
  }

  // Prepare counts by agent map from ordersPerAgent for enrichment
  const countsByAgent = new Map(ordersPerAgent.map((x) => [x.salesAgent, x.orders]));

  // Determine best selling agent by total sales value
  let bestSellingAgent = null;
  for (const [agent, sales] of salesByAgent.entries()) {
    if (!bestSellingAgent || sales > bestSellingAgent.totalSales) {
      bestSellingAgent = {
        salesAgent: agent,
        totalSales: sales,
        ordersCount: countsByAgent.get(agent) ?? 0
      };
    }
  }

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
    } catch {
      return String(value ?? 0);
    }
  };

  const metrics = [
    {
      title: formatCurrency(totalSales),
      description: 'Total Sales Value',
      trendValue: 0,
      trendDirection: 'up',
      metricMessage: '—'
    },
    {
      title: formatCurrency(bestSellingAgent?.totalSales || 0),
      description: 'Best Selling Record',
      trendValue: 0,
      trendDirection: 'up',
      metricMessage: bestSellingAgent?.salesAgent ? `Top agent: ${bestSellingAgent.salesAgent}` : 'Top agent: Unknown'
    },
    {
      title: `${orders?.length}`,
      description: 'Total Orders',
      trendValue: 0,
      trendDirection: 'up',
      metricMessage: '—'
    },
    {
      title: `${avgOrdersPerAgent.toFixed(1)}`,
      description: 'Average Order Per Agent',
      trendValue: 0,
      trendDirection: 'up',
      metricMessage: '—'
    }
  ];

  return res.status(200).json({message: "header metrics fetched successfully", data: metrics});
});


export const getChartsAnalysis = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  if (!timeRange) {
    return res.status(400).json({ message: 'timeRange query param is required. Expected format: date1,date2 (YYYY-MM-DD,YYYY-MM-DD)' });
  }

  const dates = String(timeRange).split(',').map((d) => d.trim());
  if (dates.length !== 2 || !dates[0] || !dates[1]) {
    return res.status(400).json({ message: 'Invalid timeRange. Expected two dates separated by a comma.' });
  }

  // Create inclusive day range in UTC
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate }
  }).lean();

  // Helper to parse prixttc in aggregation: remove spaces, replace comma decimal, convert to double
  const aggPriceExpr = {
    $convert: {
      input: {
        $replaceAll: {
          input: {
            $replaceAll: { input: { $ifNull: ['$prixttc', '0'] }, find: ',', replacement: '.' }
          },
          find: ' ',
          replacement: ''
        }
      },
      to: 'double',
      onError: 0,
      onNull: 0
    }
  };

  // Daily sales totals
  const salesMetricsPerDay = await Order.aggregate([
    { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate', timezone: 'UTC' } },
        totalSales: { $sum: aggPriceExpr }
      }
    },
    { $project: { _id: 0, date: '$_id', totalSales: 1 } },
    { $sort: { date: 1 } }
  ]);

  // Daily order counts
  const orderMetricsPerDay = await Order.aggregate([
    { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate', timezone: 'UTC' } },
        orderCount: { $sum: 1 }
      }
    },
    { $project: { _id: 0, date: '$_id', orderCount: 1 } },
    { $sort: { date: 1 } }
  ]);

  // Sales per agent within range
  const agentSales = await Order.aggregate([
    { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $ifNull: ['$salesAgent', 'Unknown'] },
        totalSales: { $sum: aggPriceExpr },
        orderCount: { $sum: 1 }
      }
    },
    { $project: { _id: 0, salesAgent: '$_id', totalSales: 1, orderCount: 1 } },
    { $sort: { totalSales: -1, salesAgent: 1 } }
  ]);

  return res.status(200).json({
    message: 'sales charts analysis fetched successfully',
    data: {
      orderLenght: orders?.length,
      salesMetricsPerDay,
      orderMetricsPerDay,
      agentSales
    }
  });
});


export const getSalesMetricsPerDay = errorCatchingLayer(async (req, res, next) => {
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

  const aggPriceExpr = {
    $convert: {
      input: {
        $replaceAll: {
          input: { $replaceAll: { input: { $ifNull: ['$prixttc', '0'] }, find: ',', replacement: '.' } },
          find: ' ',
          replacement: ''
        }
      },
      to: 'double',
      onError: 0,
      onNull: 0
    }
  };

  const salesMetricsPerDay = await Order.aggregate([
    { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate', timezone: 'UTC' } }, sales: { $sum: aggPriceExpr } } },
    { $project: { _id: 0, date: '$_id', sales: 1 } },
    { $sort: { date: 1 } }
  ]);

  return res.status(200).json({
    message: 'sales metrics per day fetched successfully',
    data: { salesMetricsPerDay }
  });
});


export const getOrderMetricsPerDay = errorCatchingLayer(async (req, res, next) => {
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

  const orderMetricsPerDay = await Order.aggregate([
    { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate', timezone: 'UTC' } }, orders_count: { $sum: 1 } } },
    { $project: { _id: 0, date: '$_id', orders_count: 1 } },
    { $sort: { date: 1 } }
  ]);

  return res.status(200).json({
    message: 'order metrics per day fetched successfully',
    data: { orderMetricsPerDay }
  });
});


export const getAgentSales = errorCatchingLayer(async (req, res, next) => {
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

  // 1️⃣ Price conversion expression
  const aggPriceExpr = {
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
  };

  // 2️⃣ Match stage: filter by date range
  const matchStage = {
    $match: {
      orderDate: {
        $gte: startDate,
        $lte: endDate
      }
    }
  };

  // 3️⃣ Group stage: group by normalized sales agent
  const groupStage = {
    $group: {
      _id: {
        $toLower: {
          $replaceAll: {
            input: {
              $replaceAll: {
                input: { $ifNull: ['$salesAgent', 'Unknown'] },
                find: ' ',
                replacement: '_'
              }
            },
            find: '-',
            replacement: '_'
          }
        }
      },
      sales: { $sum: aggPriceExpr },
      orders_count: { $sum: 1 }
    }
  };

  // 4️⃣ Project stage: rename fields
  const projectStage = {
    $project: {
      _id: 0,
      agent: '$_id',
      sales: 1,
      orders_count: 1
    }
  };

  // 5️⃣ Sort stage: sort by sales descending, then agent ascending
  const sortStage = {
    $sort: {
      sales: -1,
      agent: 1
    }
  };

  // 🧠 Final aggregation call
  const agentSales = await Order.aggregate([
    matchStage,
    groupStage,
    projectStage,
    sortStage
  ]);


  return res.status(200).json({
    message: 'agent sales fetched successfully',
    data: { agentSales }
  });
});


export const getOrders = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  if (!timeRange) {
    return res.status(400).json({ message: 'timeRange query param is required. Expected format: date1,date2 (YYYY-MM-DD,YYYY-MM-DD)' });
  }

  const dates = String(timeRange).split(',').map((d) => d.trim());
  if (dates.length !== 2 || !dates[0] || !dates[1]) {
    return res.status(400).json({ message: 'Invalid timeRange. Expected two dates separated by a comma.' });
  }

  // Create inclusive day range in UTC
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate }
  }).lean();

  return res.status(200).json({
    message: 'sales orders fetched successfully',
    data: {
      orders: orders
    }
  });
});


export const getPlansMetrics = errorCatchingLayer(async (req, res, next) => {
  const { plan } = req.query; // Default to 'monthly'


  if (!["day", 'week', 'month', 'year'].includes(plan)) {
    return res.status(400).json({ message: 'plan is invalid or missing. Expected : day, week, month, year' });
  }

  const dates = getDateRange(plan);

  // Create inclusive day range in UTC
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  // Use Promise.all for parallel execution
  const [result, salesPlans, ordersPlans] = await Promise.all([
    Order.aggregate([
    {
      $match: {
        orderDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $addFields: {
        // Convert prixttc from string to number, handle null/undefined
        numericPrixttc: {
          $cond: {
            if: { $eq: ["$prixttc", null] },
            then: 0,
            else: { $toDouble: "$prixttc" }
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSales: { $sum: "$numericPrixttc" }
      }
    }
  ]),
    MetricsPlans.findOne({ name: "sales_plan" }).lean(),
    MetricsPlans.findOne({ name: "orders_plan" }).lean()
  ]);

  // Safely get plan values with defaults
  const salesPlanValue = salesPlans?.[plan] || 0;
  const ordersPlanValue = ordersPlans?.[plan] || 0;
  console.log('[result]', result);
  const data = {
    sales: {
      plan: salesPlanValue,
      value: result[0]?.totalSales || 0,
    },
    orders: {
      plan: ordersPlanValue,
      value: result[0]?.totalOrders || 0,
    }
  };

  return res.status(200).json({ message: "metrics plans fetched successfully", data });
});
