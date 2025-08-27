import { ChartRadial } from '@/components/charts/RadialChart';

const chartData = [{ month: "january", left: 12800, achieved: 17200 }]

const chartConfig = {
  left: {
    label: "Left",
    color: "var(--chart-4)",
  },
  achieved: {
    label: "Achieved",
    color: "var(--chart-3)",
  },
}

const chartMetaData = {
    title: "Sales Value",
    description: 'Targeted sales value goal',
    dataKey:"Sales Value",
    nameKey:"source"
  }

export function SellGoalChart() {

    return (
      <ChartRadial
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }

