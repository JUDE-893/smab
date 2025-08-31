import axiosClient from '@/services/axiosClient'


export async function getSalesHeaderMetrics(dateRange) {
  const { data } = await axiosClient.get(`sales/header-metrics?timeRange=${dateRange}`);

  return data.data
}

export async function getAgentSalesAndOrders(dateRange) {
  const { data } = await axiosClient.get(`sales/agent-sales?timeRange=${dateRange}`);

  return data.data
}

export async function getAllOrders(dateRange) {
  const { data } = await axiosClient.get(`sales/orders?timeRange=${dateRange}`);

  return data.data
}

export async function getSalesMetricsPerDay(dateRange) {
  const { data } = await axiosClient.get(`sales/sales-metrics-per-day?timeRange=${dateRange}`);

  return data.data
}

export async function getOrderMetricsPerDay(dateRange) {
  const { data } = await axiosClient.get(`sales/order-metrics-per-day?timeRange=${dateRange}`);

  return data.data
}

export async function getMetricsPlans(plan) {
  const { data } = await axiosClient.get(`sales/metrics-plans?plan=${plan}`);

  return data.data
}
