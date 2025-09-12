"use client"

import { HeatMapChart } from '@/components/charts/HeatMapChart';


  const chartConfig = {
    fmcg: {
      label: "FMCG Rate",
      color: "var(--primary)",
    }

  }

  const chartMetaData = {
    title : "FMCG Rate",
    description: 'Number Orders including this product',
    dataKey: 'date',
    nameKey: 'fmcg',
    hideX: false,
    hideY: false,
    toolTipLabel: (value) => value

  }

export function FMCGHeatMapChart({data, isLoading, error}) {

    return (
      <HeatMapChart
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data}
        className='bg-background border-none '
        daysPerPage={50}
       />
    )
  }
