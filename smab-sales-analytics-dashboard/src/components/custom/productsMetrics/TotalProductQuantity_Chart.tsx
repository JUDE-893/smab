"use client"

import { HorizentalChartBar } from '@/components/charts/HorizentalBarChart';
import { getTotalProductsQuantity } from '@/services/productServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'


const chartData = [
    { agent: "agent1", totalQuantity: 275, fill: "var(--color-agent1)" },
    { agent: "agent2", totalQuantity: 200, fill: "var(--color-agent2)" },
    { agent: "agent3", totalQuantity: 187, fill: "var(--color-agent3)" },
    { agent: "agent4", totalQuantity: 173, fill: "var(--color-agent4)" },
    { agent: "agent5", totalQuantity: 90, fill: "var(--color-agent5)" },
  ]

const chartConfig = {
  totalQuantity: {
    label: "totalQuantity",
  },
  "000.000.493": {
    label: "totalQuantity Agent 1",
    color: "var(--chart-2)",
  },
  totalQuantity_agent2: {
    label: "totalQuantity Agent2",
    color: "var(--chart-2)",
  },
  totalQuantity_agent3: {
    label: "totalQuantity Agent3",
    color: "var(--chart-2)",
  },
  totalQuantity_agent4: {
    label: "totalQuantity Agent4",
    color: "var(--chart-2)",
  },
  totalQuantity_agent5: {
    label: "totalQuantity Agent5",
    color: "var(--chart-2)",
  },
}

const chartMetaData = {
  title: "Orders Contributions",
  description: 'Percentage of total orders attributed to an agent',
  dataKey:"totalQuantity",
  nameKey:"barcode"
}

export function TotalProductQuantity_Chart() {

  const timeRange = useTimeRange();

  const { data, isLoading, error } = useCustomQuery(
    ['products-total-quantity', timeRange],
    async () => await getTotalProductsQuantity(timeRange)
  );

  console.log('DATA', data);


  let dataRec =  data?.map((agt) => {
    return {...agt, fill: `var(--chart-2)`}
  });


    return (
      <HorizentalChartBar
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={dataRec}
       />
    )
  }
