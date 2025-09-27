import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import MetricsPlans from '../models/metricsPlanModel.js';
import logger from '../utils/logger.js';
import { getTimeRange } from '../utils/dateHelpers.js';
import { getDateRange } from '../utils/helpers.js';
import { format } from 'date-fns';

// import pool from '../config/db/mysql.js';
// import { mergeProducts } from '../utils/helpers.js';

export const getHeaderMetrics = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const {startDate, endDate} = getTimeRange(timeRange);
    orderDateFilter = {orderDate: { $gte: startDate, $lte: endDate }};
  } else {
    orderDateFilter = {}
  }

  const orders = await Order.find(orderDateFilter).lean();

  // Aggregate orders per salesAgent within the same date range
  const ordersPerAgent = await Order.aggregate([
    { $match: orderDateFilter },
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
      const formatted = new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
      return `${formatted}`;
    } catch {
      return `${value ?? 0}`;
    }
  };

  const metrics = {
  total_sales_value: formatCurrency(totalSales),
  best_selling_record: formatCurrency(bestSellingAgent?.totalSales || 0),
  total_orders: `${orders?.length}`,
  average_order_per_agent: `${avgOrdersPerAgent.toFixed(1)}`,
  best_selling_sgent : bestSellingAgent?.salesAgent
};

  return res.status(200).json({message: "header metrics fetched successfully", data: metrics});
});

export const getChartsAnalysis = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  const orders = await Order.find(orderDateFilter).lean();

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
    { $match: orderDateFilter },
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
    { $match: orderDateFilter },
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
    { $match: orderDateFilter },
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

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

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
    { $match: orderDateFilter },
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

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  const orderMetricsPerDay = await Order.aggregate([
    { $match: orderDateFilter },
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

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  // Price conversion expression
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

  // Match stage: filter by date range
  const matchStage = {
    $match: orderDateFilter
  };

  // Group stage: group by normalized sales agent
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

  // Project stage: rename fields
  const projectStage = {
    $project: {
      _id: 0,
      agent: '$_id',
      sales: 1,
      orders_count: 1
    }
  };

  // Sort stage: sort by sales descending, then agent ascending
  const sortStage = {
    $sort: {
      sales: -1,
      agent: 1
    }
  };

  // Final aggregation call
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

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  const orders = await Order.find(orderDateFilter).lean();

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

/**
 * getSalesAgentAnalytics - Returns detailed analytics for a specific sales agent within a given year
 *
 * @param {string} salesAgent - Required. The name of the sales agent to analyze
 * @param {number} year - Optional. The target year for analysis (defaults to current year)
 *
 * @returns {Object} Response object containing:
 *   - message: Success message
 *   - data: {
 *       sales_agent: string,           // Sales agent name
 *       totalRevenue: number,          // Total revenue generated by the agent
 *       totalOrders: number,           // Total number of orders handled by the agent
 *       dailyOrders: Array<{           // Daily order count breakdown
 *         date: string,                // Date in YYYY-MM-DD format
 *         order_count: number          // Number of orders on that date
 *       }>,
 *       monthlyAnalysis: Array<{       // Monthly performance breakdown
 *         month: string,               // Month name (January-December)
 *         orders_count: number,        // Number of orders in the month
 *         revenue: number              // Revenue generated in the month
 *       }>
 *     }

 */
export const getSalesAgentAnalytics = errorCatchingLayer(async (req, res, next) => {
  const { salesAgent, year } = req.query;

  if (!salesAgent) {
    return res.status(400).json({ message: 'salesAgent query param is required' });
  }

  // Set default to current year if not provided
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  // Create date range for the entire year
  const startDate = new Date(targetYear, 0, 1); // January 1st of the year
  const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999); // December 31st of the year

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  // Get orders for this sales agent in the date range
  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate },
    salesAgent: salesAgent
  }).lean();

  // Initialize monthly data structure
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthlyData = monthNames.map(month => ({
    month,
    orders_count: 0,
    revenue: 0
  }));

  // Initialize daily orders data structure (will use a map for daily tracking)
  const dailyOrdersMap = new Map();

  // Initialize totals
  let totalRevenue = 0;
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
    totalRevenue += orderRevenue;

    // Update monthly data
    const orderMonth = new Date(order.orderDate).getMonth();
    monthlyData[orderMonth].orders_count += 1;
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
    message: 'Sales agent analytics fetched successfully',
    data: {
      sales_agent: salesAgent,
      totalRevenue,
      totalOrders,
      dailyOrders,
      monthlyAnalysis: monthlyData
    }
  });
});
