"use client"

import { MonoPieChart } from '@/components/charts/MonoPieChart';
import { getCustomersMetrics } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'
import { TrendingUp } from "lucide-react"
import { formatPrice } from '@/lib/utils';

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
  title: "Heightest Consuming Clients",
  description: 'Top #10 customers with heightest purchase value',
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

 chartMetaData.chartFooter = {
   title: ( <> <span className="text-md text-muted-foreground">#1</span> {data?.[0]?.customer_name}{" "} <TrendingUp className="h-4 w-4" /> </> ),
   description: (
     <>
       Leading the purchase value with{" "}
       {data?.[0]?.revenue ? (
         <>
           {formatPrice(data?.[0]?.revenue)}{" "}
           <span className="text-xs">MAD</span>
         </>
       ) : (
         "Unknown"
       )}
     </>
   )
 };

  return (
    <MonoPieChart
      chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
      chartConfig={chartConfig}
      chartData={dataRec}
     />
  )
}
