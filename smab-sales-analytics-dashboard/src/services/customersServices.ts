import axiosClient from '@/services/axiosClient'

export async function getCustomersMetrics(dateRange) {
  const { data } = await axiosClient.post('/protected', { target: `customers?timeRange=${dateRange}` });

  return data.data
}

export async function getCustomerAnalysis(customerName, year) {
  const { data } = await axiosClient.post('/protected', { target: `customers/customer-analysis?customerName=${customerName}${year ? `&year=${year}` : ""}` });

  return data.data
}
