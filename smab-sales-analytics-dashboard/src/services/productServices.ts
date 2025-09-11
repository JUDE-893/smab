import axiosClient from '@/services/axiosClient'


export async function getTotalProductsQuantity(dateRange) {
  const { data } = await axiosClient.get(`product/quantity?timeRange=${dateRange}`);

  return data.data
}

export async function getOrdersProducts(dateRange) {
  const { data } = await axiosClient.get(`product/all?timeRange=${dateRange}`);

  return data.data
}

export async function getProductDetails(codebar, year) {
  const { data } = await axiosClient.get(`product/analytics?codebar=${codebar}${year && `&&year=${year}`}`);

  return data.data
}
