"use client"

import { HorizentalChartBar } from '@/components/charts/HorizentalBarChart';
import { getAgentSalesAndOrders } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'


const chartData = [
    { agent: "agent1", sales: 275, fill: "var(--color-agent1)" },
    { agent: "agent2", sales: 200, fill: "var(--color-agent2)" },
    { agent: "agent3", sales: 187, fill: "var(--color-agent3)" },
    { agent: "agent4", sales: 173, fill: "var(--color-agent4)" },
    { agent: "agent5", sales: 90, fill: "var(--color-agent5)" },
  ]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  sales_agent1: {
    label: "Sales Agent 1",
    color: "var(--chart-2)",
  },
  sales_agent2: {
    label: "Sales Agent2",
    color: "var(--chart-2)",
  },
  sales_agent3: {
    label: "Sales Agent3",
    color: "var(--chart-2)",
  },
  sales_agent4: {
    label: "Sales Agent4",
    color: "var(--chart-2)",
  },
  sales_agent5: {
    label: "Sales Agent5",
    color: "var(--chart-2)",
  },
}

const chartMetaData = {
  title: "Orders Contributions",
  description: 'Percentage of total orders attributed to an agent',
  dataKey:"sales",
  nameKey:"agent"
}

export function AgentOrdersSharesChart() {

  const timeRange = useTimeRange();

  const { data, isLoading } = useCustomQuery(
    ['agent-sales-and-orders',timeRange],
    async () => await getAgentSalesAndOrders(timeRange)
  );


  let dataRec = data?.agentSales?.map((agt) => {
    return {...agt, fill: `var(--color-${agt?.agent})`}
  })

    return (
      <HorizentalChartBar
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={dataRec}
       />
    )
  }
