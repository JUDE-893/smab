"use client"

import { MonoChartBar } from '@/components/charts/MonoBarChart';


  const chartConfig = {
    quantity: {
      label: "Quantity",
      color: "var(--chart-2)",
    },
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    }
  }

  const chartMetaData = {
    title : "Product Metricts",
    description: 'metrics of total Revenue and quantity of product sold',
    hideX: true,
    hideY: false,
    toolTipLabel: (value) => value

  }

export function ProductActivityChart({data, isLoading, error}) {

    return (
      <MonoChartBar
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data}
        className=' lg:px-[4%] lg:py-[3%] bg-background border-none '
       />
    )
  }
