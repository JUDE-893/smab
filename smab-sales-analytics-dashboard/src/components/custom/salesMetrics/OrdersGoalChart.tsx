"use client"

import { ChartRadial } from '@/components/charts/RadialChart';
import { getMetricsPlans } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'

// const chartData = [{ month: "january", left: 260, achieved: 170 }]

const chartConfig = {
  plan: {
    label: "Left",
    color: "var(--chart-1)",
  },
  value: {
    label: "Achieved",
    color: "var(--chart-2)",
  },
}

const chartMetaData = {
    title: "Orders Goal",
    description: 'Targeted orders goal',
    dataKey:"Orders",
    nameKey:"source"
  }

export function OrdersGoalChart() {

  const plan = "month";

  const { data, isLoading, error } = useCustomQuery(
    ['metrics-plans', plan],
    async () => await getMetricsPlans(plan)
  )


  const chartData = data?.orders ? [{...data?.orders, plan: data?.orders?.plan - data?.orders?.value}] : [];
  console.log('chartData', chartData);

    return (
      <ChartRadial
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={chartData}
        id='orders-goal'
        className='chart-container'
       />
    )
  }
