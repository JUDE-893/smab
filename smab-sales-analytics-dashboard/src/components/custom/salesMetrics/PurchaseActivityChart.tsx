"use client"

import { MonoChartBar } from '@/components/charts/MonoBarChart';


  const chartConfig = {
    orders_count: {
      label: "Orders",
      color: "var(--chart-3)",
    },
    revenue: {
      label: "Revenue",
      color: "var(--chart-2)",
    }
  }

  const chartMetaData = {
    title : "Sales Analysis",
    description: 'metrics of total Revenue and orders assisted',
    hideX: true,
    hideY: false,
    toolTipLabel: (value) => value,
    YaWidth:45

  }

export function PurchaseActivityChart({data, isLoading, error}) {

    return (
      <MonoChartBar
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data}
        className=' lg:px-[4%] lg:py-[3%] bg-background border-none '
       />
    )
  }
