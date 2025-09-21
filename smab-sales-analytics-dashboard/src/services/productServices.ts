import axiosClient from '@/services/axiosClient'


export async function getTotalProductsQuantity(dateRange) {
  const { data } = await axiosClient.get(`product/quantity?timeRange=${dateRange}`);

  return data.data
}

export async function getOrdersProducts(dateRange) {
  const { data } = await axiosClient.post('/protected', { target: `product/all?timeRange=${dateRange}` });

  return data.data
}


export async function getProductDetails(barcode, year) {
  const { data } = await axiosClient.post('/protected', { target: `product/analytics?barcode=${barcode}${year ? `&year=${year}` : ''}` });

  return data.data
}
