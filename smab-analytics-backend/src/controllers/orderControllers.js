
import axios from 'axios';
import { ProductDetails } from '../models/ProductModel.js';
import { errorCatchingLayer } from '../utils/helpers.js';
import Order from '../models/orderModel.js';
import logger from '../utils/logger.js';
import { format } from 'date-fns';
// import pool from '../config/db/mysql.js';
// import { mergeProducts } from '../utils/helpers.js';



function filterOutWarehouseProducts(existingProducts, warehouse) {
    let filteredPds = existingProducts.filter((pds) => pds.warehouse !== warehouse)
    return filteredPds
  }

/**
 * Insert new order document or update existing one.
 * @param {object} orderInfo - object of product infos.
 */
async function insertOrUpdateOrder(orderInfo) {
    console.log("orderInfo", orderInfo);
    let retry = true,
    retriesCount = 1;
  
    while (retry && retriesCount <= 3) {
      retry = false;
      retriesCount += 1;
      try {
        // FIND
        const order = await Order.findOne({ orderNumber: orderInfo?.orderNumber });
  
        if (!order) {
          // INSERT
          const populatedProducts = await enrichProductsWithDetailsBatched(orderInfo.products)
          console.log("populatedProducts----------------------", populatedProducts);
          orderInfo.products = populatedProducts;
          let newOrder = await Order.create(orderInfo);
          logger.info('🎉 Order created:', orderInfo?.orderNumber);
          // UPDATE STOCK
          await updateStock('decrease', orderInfo.products); // Subtracts quantities
          // return new order data
          return orderInfo;
        } else {
          // UPDATE
          const now = new Date();
          // let reconciliedProducts = mergeProducts(order.products, orderInfo.products)
          let reconciliedProducts = [...orderInfo.products, ...filterOutWarehouseProducts(order.products,orderInfo.products[0]?.warehouse)];
          
          // populate the produncts details
          const populatedProducts = await enrichProductsWithDetailsBatched(reconciliedProducts)
          console.log("populatedProducts----------------------", populatedProducts);
          
          // update query
          const update = {
            $set: {
              // mutable fields that should be updated each time
              updatedAt: now,
              products : populatedProducts
            }
          };
          // update request
          const updatedOrder = await Order.findOneAndUpdate(
            { orderNumber: orderInfo.orderNumber },
            update,
            { new: true }
          );
  
          logger.info('🔄 Order updated:', updatedOrder?.orderNumber);
          // UPDATE STOCK
          // await updateStock('increase', order.products); // Adds quantities back
          // await updateStock('decrease', updatedOrder.products); // Subtracts quantities
          // return order new order data
          orderInfo.orderUpdateDate = format(new Date(), 'HH:mm dd/MM/yyyy');
          orderInfo.products = reconciliedProducts;
          return orderInfo;
        };
      } catch (err) {
        // check for duplicate error
        const isDup = err && (err.code === 11000 || err.name === 'MongoServerError' && err.code === 11000);
        if (isDup) {
          retry = true
        };
        // log error after retrying 3 times
        if (retriesCount > 3) {
          logger.error('❌ Error processing order after 3 unseuccessfull retry times:', orderInfo.orderNumber, err);
        }
        logger.error('❌ Error processing order:', orderInfo.orderNumber, err);
        console.log(err);
  
      }
    }
  }
  
/**
 * Updates stock for multiple products.
 * @param {'increase' | 'decrease'} operation - Whether to add or subtract stock.
 * @param {Array} products - Array of product objects.
 */
async function updateStock(operation, products) {
if (!['increase', 'decrease'].includes(operation)) {
    throw new Error('Invalid operation: must be "increase" or "decrease"');
}

const sign = operation === 'increase' ? '+' : '-';

const query = `
    UPDATE llx_product_stock ps
    JOIN llx_product p ON ps.fk_product = p.rowid
    JOIN llx_entrepot e ON ps.fk_entrepot = e.rowid
    SET ps.reel = ps.reel ${sign} ?
    WHERE p.ref = ? AND e.ref = ?
`;

const connection = await pool.getConnection();
try {
    await connection.beginTransaction();

    for (const product of products) {
    const { quantity, barcode, warehouse } = product;
    await connection.execute(query, [quantity, barcode, warehouse]);
    }

    await connection.commit();
    logger.info(`✅ Stock ${operation}d for ${products.length} products`);
} catch (err) {
    await connection.rollback();
    logger.error('❌ Error updating stock:', err);
    console.log(err);
    throw err;
} finally {
    connection.release();
}
}

async function getClientData(orderID) {
    const response = await fetch(`${process.env.CLIENTS_API_URL}/${orderID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.CLIENTS_API_TOKEN}`
        }
      });
      return response.json();
}

export const createOrUpdateOrder = errorCatchingLayer(async (req, res, next) => {
    
    const orderData = req?.body;

    const clientData = await getClientData(orderData?.orderNumber)

    const lead = clientData?.lead ?? null;
    const prixttc = lead?.prixttc ?? clientData?.prixttc ?? null;
    const paymentMethod = lead?.typedepaiement?.label ?? clientData?.typedepaiement?.label ?? null;
    const customerName = lead?.customer?.label ?? clientData?.customer?.label ?? null;

 

    const order = await insertOrUpdateOrder({ ...orderData, prixttc, paymentMethod, customerName });

    return res.status(200).json({
        message: 'Order created successfully',
        data: order
    });
});



/**
 * Enriches products with details from database or external API
 * @param {Array} products - Array of product objects with barcode field
 * @returns {Promise<Array>} - Updated products array with details _id
 */
async function enrichProductsWithDetails(products) {
  try {
    // Step 1: Extract all barcodes from products
    const barcodes = products.map(product => product.barcode);
    
    // Step 2: Batch search for existing product details
    const existingDetails = await ProductDetails.find({
      ref: { $in: barcodes }
    });
    
    // Create a map for quick lookup: ref -> productDetails document
    const detailsMap = new Map();
    existingDetails.forEach(detail => {
      detailsMap.set(detail.ref, detail);
    });
    
    // Step 3: Separate found and not found products
    const productsWithDetails = [];
    const productsWithoutDetails = [];
    const missingBarcodes = new Set();
    
    products.forEach(product => {
      const detailDoc = detailsMap.get(product.barcode);
      if (detailDoc) {
        // Product found in database - assign the _id
        product.details = detailDoc._id;
        productsWithDetails.push(product);
      } else {
        // Product not found - mark for API call
        productsWithoutDetails.push(product);
        missingBarcodes.add(product.barcode);
      }
    });
    
    // Step 4: If there are missing products, fetch from API
    if (productsWithoutDetails.length > 0) {
      const missingBarcodesArray = Array.from(missingBarcodes);
      
      console.log("[URL INVALID]", process.env.PRODUCTDETAILS_URL);
      try {
        // Step 5: Make POST request to external API
        const response = await axios.post(process.env.PRODUCTDETAILS_URL, {
          barcodes: missingBarcodesArray
        });
        
        const apiProducts = response?.data?.data; // Expected format: [{ref: 'p345345', prix_ttc: 100}, ...]

        console.log('[apiProducts]', apiProducts);
        
        
        // Step 6: Save new product details to database
        const newDetails = await ProductDetails.insertMany(apiProducts, {
          ordered: false // Continue even if there are duplicates (though ref is unique)
        });
        
        // Create a map for the newly created details
        const newDetailsMap = new Map();
        newDetails.forEach(detail => {
          newDetailsMap.set(detail.ref, detail);
        });
        
        // Step 7: Update the products without details
        productsWithoutDetails.forEach(product => {
          const newDetail = newDetailsMap.get(product.barcode);
          if (newDetail) {
            product.details = newDetail._id;
            productsWithDetails.push(product);
          } else {
            // Handle case where API didn't return details for this barcode
            console.warn(`No details found for barcode: ${product.barcode}`);
            // You might want to handle this differently based on your requirements
            productsWithDetails.push(product); // Keep product even without details
          }
        });
        
      } catch (apiError) {
        console.error('Error fetching product details from API:', apiError);
        // If API fails, you might want to handle this differently
        // For now, we'll return products with only the ones that had existing details
        throw new Error(`Failed to fetch product details from API: ${apiError.message}`);
      }
    }
    
    // Step 8: Return the final products array
    return productsWithDetails;
    
  } catch (error) {
    console.error('Error in enrichProductsWithDetails:', error);
    throw error;
  }
}

// Alternative version with better error handling and batching for large arrays
async function enrichProductsWithDetailsBatched(products, batchSize = 50) {
  const results = [];
  
  // Process products in batches to avoid overwhelming the API/database
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const enrichedBatch = await enrichProductsWithDetails(batch);
    results.push(...enrichedBatch);
  }
  
  return results;
}

