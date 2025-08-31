import * as XLSX from 'xlsx';


export const exportOrdersToExcel = (orders: Order[], timeRange: string): void => {

  const transformData = (orders: any[]) => {
    return orders.map(order => {
      const { _id, __v, products, ...rest } = order;

      return {
        ...rest,
        ProductsNumber: products.length,
        updatedAt: order.updatedAt || '', // Add updatedAt if exists
        Notes: order.Notes || '' // Add Notes if exists (empty string if not)
      };
    });
  };

  console.log('[EXCEL]', orders);

  if (!orders) return;

  const transformedData = transformData(orders);
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, `orders-${timeRange}.xlsx`);
};
