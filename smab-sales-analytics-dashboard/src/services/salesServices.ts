import axiosClient from '@/services/axiosClient'

export async function getSalesHeaderMetrics(dateRange) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/header-metrics?timeRange=${dateRange}` });

  return data.data
}

export async function getAgentSalesAndOrders(dateRange) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/agent-sales?timeRange=${dateRange}` });

  return data.data
}

export async function getAllOrders(dateRange) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/orders?timeRange=${dateRange}` });

  return data.data
}

export async function getSalesMetricsPerDay(dateRange) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/sales-metrics-per-day?timeRange=${dateRange}` });

  return data.data
}

export async function getOrderMetricsPerDay(dateRange) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/order-metrics-per-day?timeRange=${dateRange}` });

  return data.data
}

export async function getMetricsPlans(plan) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/metrics-plans?plan=${plan}` });

  return data.data
}

export async function getAgentAnalysis(salesAgent, year) {
  const { data } = await axiosClient.post('/proxy/protected', { target: `sales/sales-agent-analytics?salesAgent=${salesAgent}${year ? `&year=${year}` : ""}` });

  return data.data
}
