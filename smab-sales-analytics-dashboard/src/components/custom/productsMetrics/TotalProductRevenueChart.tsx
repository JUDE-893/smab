"use client"

import { HorizentalChartBar } from '@/components/charts/HorizentalBarChart';
import { getOrdersProducts } from '@/services/productServices';
import { useCustomQuery } from '@/hooks/useCustomQuery';
import { useTimeRange } from '@/hooks/useTimeRange';
import { formatPrice } from "@/lib/utils";

let chartConfig = {
  revenue: {
    label: "Revenue",
  }
}

const chartMetaData = {
  title: "Total Product Revenue",
  description: 'Overview of total revenue for product sold',
  dataKey:"revenue",
  nameKey:"barcode",
  hideLabel: false,
  hideX: true,
  hideY: true,
  innerLeftLabelFormatter: (value) => value,
  innerRightLabelFormatter: (value) => formatPrice(value)
}

export function TotalProductRevenueChart() {

  const timeRange = useTimeRange();

  const { data, isLoading, error } = useCustomQuery(
    ['orders-products', timeRange],
    async () => await getOrdersProducts(timeRange)
  );

  let dataRec =  data?.map((agt) => {
    return {...agt, fill: `var(--chart-2)`}
  });

   data?.forEach(element => {
    chartConfig[element?.barcode] = {label: `${element?.barcode} - ${element?.name}`}
  });


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
