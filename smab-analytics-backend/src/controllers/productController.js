import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import { ProductDetails } from '../models/productModel.js';
import MetricsPlans from '../models/metricsPlanModel.js';
import logger from '../utils/logger.js';
import { getDateRange } from '../utils/helpers.js';
import { format } from 'date-fns';


export const getProductsQuantity = errorCatchingLayer(async (req, res, next) => {
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

    // Get orders in the date range
    const orders = await Order.find({
      orderDate: { $gte: startDate, $lte: endDate }
    }).lean();

    // Aggregate product quantities
    const productQuantities = new Map();

    orders.forEach(order => {
      order.products.forEach(product => {
        const key = `${product.barcode}-${product.name}`;
        const existing = productQuantities.get(key) || {
          name: product.name,
          barcode: product.barcode,
          totalQuantity: 0
        };

        existing.totalQuantity += product.quantity;
        productQuantities.set(key, existing);
      });
    });

    // Convert to array and sort by quantity descending
    const productsArray = Array.from(productQuantities.values());
    const sortedProducts = productsArray.sort((a, b) => b.totalQuantity - a.totalQuantity);

    return res.status(200).json({
      message: 'Products quantity fetched successfully',
      data: sortedProducts
    });
  });

export const getProductsRevenue = errorCatchingLayer(async (req, res, next) => {
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

  // Get orders in the date range
  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate }
  }).lean();

  // Get all unique product barcodes from orders
  const barcodes = [...new Set(
    orders.flatMap(order =>
      order.products.map(product => product.barcode)
    )
  )];

  // Get product details for these barcodes
  const productDetails = await ProductDetails.find({
    ref: { $in: barcodes }
  }).lean();


  // Create a map of barcode to price
  const priceMap = new Map();
  productDetails.forEach(detail => {
    priceMap.set(detail.ref, detail.price_ttc);
  });
  console.log("[productDetails]", priceMap);

  // Aggregate product revenue
  const productRevenue = new Map();

  orders.forEach(order => {
    order.products.forEach(product => {
      const key = `${product.barcode}-${product.name}`;
      const existing = productRevenue.get(key) || {
        name: product.name,
        barcode: product.barcode,
        revenue: 0
      };

      // Get price from our map, default to 0 if not found
      const productPrice = priceMap.get(product.barcode) || 0;
      const productRevenueValue = productPrice * product.quantity;

      existing.revenue += productRevenueValue;
      productRevenue.set(key, existing);
    });
  });

  // Convert to array and sort by revenue descending
  const productsArray = Array.from(productRevenue.values());
  const sortedProducts = productsArray.sort((a, b) => b.revenue - a.revenue);

  return res.status(200).json({
    message: 'Products revenue fetched successfully',
    data: sortedProducts
  });
});

export const getSalesProduct = errorCatchingLayer(async (req, res, next) => {
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

  // Get orders in the date range
  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate }
  }).lean();

  // Get all unique product barcodes from orders
  const barcodes = [...new Set(
    orders.flatMap(order =>
      order.products.map(product => product.barcode)
    )
  )];

  // Get product details for these barcodes
  const productDetails = await ProductDetails.find({
    ref: { $in: barcodes }
  }).lean();


  // Create a map of barcode to price
  const priceMap = new Map();
  productDetails.forEach(detail => {
    priceMap.set(detail.ref, detail.price_ttc);
  });
  console.log("[productDetails]", priceMap);

  // Aggregate product revenue
  const productRevenue = new Map();

  orders.forEach(order => {
    order.products.forEach(product => {
      const key = `${product.barcode}-${product.name}`;
      const existing = productRevenue.get(key) || {
        name: product.name,
        barcode: product.barcode,
        quantity: 0,
        revenue: 0,
        order_frequency: 0
      };

      // Get price from our map, default to 0 if not found
      const productPrice = priceMap.get(product.barcode) || 0;
      const productRevenueValue = productPrice * product.quantity;

      existing.revenue += productRevenueValue;
      existing.quantity += product.quantity;
      existing.order_frequency += 1;
      productRevenue.set(key, existing);


    });
  });

  // Convert to array and sort by revenue descending
  const productsArray = Array.from(productRevenue.values());
  const sortedProducts = productsArray.sort((a, b) => b.revenue - a.revenue);

  return res.status(200).json({
    message: 'Products revenue fetched successfully',
    data: sortedProducts
  });
});
