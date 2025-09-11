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
  title: "Total Product Quantity",
  description: 'Overview of total quantity for product sold',
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




  let dataRec =  data?.map((agt) => {
    return {...agt, fill: `var(--chart-2)`}
  });

   data?.forEach(element => {
    chartConfig[element?.barcode] = {label: `${element?.barcode} - ${element?.name}`}
  });




    // return (
    //   <HorizentalBarChartPage
    //     chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
    //     chartConfig={chartConfig}
    //     chartData={dataRec}
    //    />
    // )

    // In your TotalProductQuantity_Chart component:
    return (
      <HorizentalChartBar
        chartMetaData={{...chartMetaData, isLoading, error}}
        chartConfig={chartConfig}
        chartData={dataRec}
        itemsPerPage={12} // Optional: customize items per page
      />
    )
  }
