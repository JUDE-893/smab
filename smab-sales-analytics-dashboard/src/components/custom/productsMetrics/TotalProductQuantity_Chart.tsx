"use client"

import { HorizentalChartBar } from '@/components/charts/HorizentalBarChart';
import { getTotalProductsQuantity } from '@/services/productServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

let chartConfig = {
  totalQuantity: {
    label: "totalQuantity",
  }
}

const chartMetaData = {
  title: "Orders Contributions",
  description: 'Percentage of total orders attributed to an agent',
  dataKey:"totalQuantity",
  nameKey:"barcode",
  hideLabel: false,
  hideX: true,
  hideY: true,
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

   data?.forEach(element => {
    chartConfig[element?.barcode] = {label: element?.name}
  });
  console.log('ChartConfig', chartConfig);



    return (
      <HorizentalChartBar
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={dataRec}
       />
    )
  }
