import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import { ProductDetails } from '../models/ProductModel.js';
import { getTimeRange } from '../utils/dateHelpers.js';
import { format } from 'date-fns';

export const getProductsQuantity = errorCatchingLayer(async (req, res, next) => {
  const { timeRange } = req.query;

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  // Get orders in the date range
  const orders = await Order.find(orderDateFilter).lean();

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

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  // Get orders in the date range
  const orders = await Order.find(orderDateFilter).lean();

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
    priceMap.set(detail.ref, detail.prix_ttc);
  });

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

  let orderDateFilter;
  if (timeRange && timeRange !== "all") {
    const { startDate, endDate } = getTimeRange(timeRange);
    orderDateFilter = { orderDate: { $gte: startDate, $lte: endDate } };
  } else {
    orderDateFilter = {};
  }

  // Get orders in the date range
  const orders = await Order.find(orderDateFilter).lean();

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
    priceMap.set(detail.ref, detail.prix_ttc);
  });

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

export const getProductAnalytics = errorCatchingLayer(async (req, res, next) => {
  const { barcode, year } = req.query;

  if (!barcode) {
    return res.status(400).json({ message: 'barcode query param is required' });
  }

  // Set default to current year if not provided
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  // Create date range for the entire year
  const startDate = new Date(targetYear, 0, 1); // January 1st of the year
  const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999); // December 31st of the year

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  // Get product details
  const productDetail = await ProductDetails.findOne({ ref: barcode }).lean();
  console.log("[PD]", productDetail);

  if (!productDetail) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Get orders in the date range that contain this product
  const orders = await Order.find({
    orderDate: { $gte: startDate, $lte: endDate },
    'products.barcode': barcode
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

  // Initialize FMCG data structure (will use a map for daily tracking)
  const fmcgMap = new Map();

  // total sales
  let totalSalesValue = 0;

  // Process each order
  orders.forEach(order => {
    // Find the product in this order
    const productInOrder = order.products.find(p => p.barcode === barcode);
    if (!productInOrder) return;

    const quantity = productInOrder.quantity;
    const revenue = productDetail.prix_ttc * quantity;

    totalSalesValue += revenue;

    // Update monthly data
    const orderMonth = new Date(order.orderDate).getMonth();
    monthlyData[orderMonth].quantity += quantity;
    monthlyData[orderMonth].revenue += revenue;

    // Update FMCG data (daily order frequency)
    const orderDateStr = format(new Date(order.orderDate), 'yyyy-MM-dd');
    const currentCount = fmcgMap.get(orderDateStr) || 0;
    fmcgMap.set(orderDateStr, currentCount + 1);
  });

  // Convert FMCG map to array of objects
  const fmcgData = Array.from(fmcgMap.entries()).map(([date, fmcg]) => ({
    date,
    fmcg
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get product name from any order that contains it
  const productName = orders.length > 0
    ? orders[0].products.find(p => p.barcode === barcode).name
    : 'Unknown Product';

  return res.status(200).json({
    message: 'Product analytics fetched successfully',
    data: {
      barcode,
      name: productName,
      prix_ttc: productDetail.prix_ttc,
      totalSalesValue,
      productActivity: monthlyData,
      fmcg: fmcgData
    }
  });
});
