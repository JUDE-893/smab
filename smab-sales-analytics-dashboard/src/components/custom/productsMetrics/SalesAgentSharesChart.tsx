"use client"

import { MonoPieChart } from '@/components/charts/MonoPieChart';
import { getOrdersProducts } from '@/services/productServices'
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
  nameKey:"barcode"
}

export function SalesAgentSharesChart() {

  const timeRange = useTimeRange();

  const { data, isLoading, error } = useCustomQuery(
    ['orders-products', timeRange],
    async () => await getOrdersProducts(timeRange)
  );

  let dataRec = data?.slice(0, 10);
  console.log("[dataRec]", dataRec);

  dataRec?.forEach((element, i) => {
   chartConfig[element?.barcode] = {label: `${element?.barcode} - ${element?.name}`, color: tenColor[i]}
 });

  return (
    <MonoPieChart
      chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
      chartConfig={chartConfig}
      chartData={dataRec}
     />
  )
}
