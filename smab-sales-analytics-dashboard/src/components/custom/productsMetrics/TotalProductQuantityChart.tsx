"use client"

import { MonoChartBar } from '@/components/charts/MonoBarChart';
import { getOrdersProducts } from '@/services/productServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'
import { log } from 'console';


  const chartConfig = {
    quantity: {
      label: "Quantity",
      color: "var(--chart-2)",
    }
  }

  const chartMetaData = {
    title : "Total Product Quantity",
    description: 'metrics of total orders made in this period',
    dataKey: "barcode",
    nameKey: "quantity",
    hideX: true,
    hideY: false,
    toolTipLabel: (value) => value

  }

export function TotalProductQuantityChart() {

  const timeRange = useTimeRange();


  const { data, isLoading, error } = useCustomQuery(
    ['orders-products', timeRange],
    async () => await getOrdersProducts(timeRange)
  );

    console.log("[DATA]", data);


    return (
      <MonoChartBar
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data}
       />
    )
  }
