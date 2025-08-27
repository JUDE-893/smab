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
  
          // update query
          const update = {
            $set: {
              // mutable fields that should be updated each time
              updatedAt: now,
              products : reconciliedProducts
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

    console.log("[client fields]", { prixttc, paymentMethod, customerName });

    const order = await insertOrUpdateOrder({ ...orderData, prixttc, paymentMethod, customerName });

    return res.status(200).json({
        message: 'Order created successfully',
        data: order
    });
});

