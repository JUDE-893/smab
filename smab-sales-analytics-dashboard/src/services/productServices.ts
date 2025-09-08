import axiosClient from '@/services/axiosClient'


export async function getTotalProductsQuantity(dateRange) {
  const { data } = await axiosClient.get(`product/quantity?timeRange=${dateRange}`);

  return data.data
}

