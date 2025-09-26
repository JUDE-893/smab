"use client"

import { HeatMapChart } from '@/components/charts/HeatMapChart';


  const chartConfig = {
    order_count: {
      label: "Order",
      color: "var(--primary)",
    }

  }

  const chartMetaData = {
    title : "Orders",
    description: 'Number Orders made',
    dataKey: 'date',
    nameKey: 'order_count',
    hideX: false,
    hideY: false,
    toolTipLabel: (value) => value

  }

export function CustomerOrdersHeatMapChart({data, isLoading, error}) {

    return (
      <HeatMapChart
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data}
        className='bg-background border-none '
        daysPerPage={500}
       />
    )
  }
