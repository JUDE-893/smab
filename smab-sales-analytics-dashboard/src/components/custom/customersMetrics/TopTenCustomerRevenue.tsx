"use client"

import { MonoPieChart } from '@/components/charts/MonoPieChart';
import { getCustomersMetrics } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

let tenColor = [
  `var(--chart-1)`,
  `var(--chart-2)`,
  `var(--chart-3)`,
  `var(--chart-4)`,
  `var(--chart-5)`,
  `var(--chart-1-foreground)`,
  `var(--chart-2-foreground)`,
  `var(--chart-3-foreground)`,
  `var(--chart-4-foreground)`,
  `var(--chart-5-foreground)`
]

const chartConfig = {}

const chartMetaData = {
  title: "Best Sellers Products",
  description: 'Top #10 Best selling products with heightest revenue',
  dataKey:"revenue",
  nameKey:"customer_name",
  pieLabel: false
}

export function TopTenCustomerRevenue() {

  const timeRange = useTimeRange();

  const { data, isLoading, error } = useCustomQuery(
    ['customers-metrics', timeRange],
    async () => await getCustomersMetrics(timeRange)
  );

  let dataRec = data?.slice(0, 10);


  dataRec?.forEach((element, i) => {
   chartConfig[element?.customer_name] = {label: `#${i+1} : ${element?.customer_name}`, color: tenColor[i]}
 });

  return (
    <MonoPieChart
      chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
      chartConfig={chartConfig}
      chartData={dataRec}
     />
  )
}
