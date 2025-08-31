"use client"

import { MonoPieChart } from '@/components/charts/MonoPieChart';
import { getAgentSalesAndOrders } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

const chartData = [
  { source: "chrome", leads: 275, fill: "var(--color-chrome)" },
  { source: "safari", leads: 200, fill: "var(--color-safari)" },
  { source: "firefox", leads: 187, fill: "var(--color-firefox)" },
  { source: "edge", leads: 173, fill: "var(--color-edge)" },
  { source: "other", leads: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  sales_agent1: {
    label: "Sales Agent 1",
    color: "var(--chart-1)",
  },
  sales_agent2: {
    label: "Sales Agent2",
    color: "var(--chart-2)",
  },
  sales_agent3: {
    label: "Sales Agent3",
    color: "var(--chart-3)",
  },
  sales_agent4: {
    label: "Sales Agent4",
    color: "var(--chart-4)",
  },
  sales_agent5: {
    label: "Sales Agent5",
    color: "var(--chart-5)",
  },
}

const chartMetaData = {
  title: "Sales Shares",
  description: 'Percentage of total sales attributed to an agent',
  dataKey:"sales",
  nameKey:"agent"
}

export function SalesAgentSharesChart() {

  const timeRange = useTimeRange();

  const { data, isLoading } = useCustomQuery(
    ['agent-sales-and-orders',timeRange],
    async () => await getAgentSalesAndOrders(timeRange)
  )


  return (
    <MonoPieChart
      chartMetaData={chartMetaData}
      chartConfig={chartConfig}
      chartData={data?.agentSales}
     />
  )
}
