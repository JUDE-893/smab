"use client"

import { ChartRadial } from '@/components/charts/RadialChart';
import { getMetricsPlans } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'


// const chartData = [{ month: "january", left: 12800, achieved: 17200 }]

const chartConfig = {
  plan: {
    label: "Left",
    color: "var(--chart-4)",
  },
  value: {
    label: "Sales",
    color: "var(--chart-3)",
  },
}

const chartMetaData = {
    title: "Sales Goal",
    description: 'Targeted sales value goal',
    dataKey:"Sales Value",
    nameKey:"source"
  }

export function SellGoalChart() {


  const plan = "month";

  const { data, isLoading } = useCustomQuery(
    ['metrics-plans', plan],
    async () => await getMetricsPlans(plan)
  )

  const chartData = data?.sales ? [{...data?.sales, plan: data?.sales?.plan - data?.sales?.value}] : [];
  
    return (
      <ChartRadial
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }
