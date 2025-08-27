import { ChartRadial } from '@/components/charts/RadialChart';

const chartData = [{ month: "january", left: 260, achieved: 170 }]

const chartConfig = {
  left: {
    label: "Left",
    color: "var(--chart-1)",
  },
  achieved: {
    label: "Achieved",
    color: "var(--chart-2)",
  },
}

const chartMetaData = {
    title: "Leads Goal",
    description: 'Targeted leads generation goal',
    dataKey:"Leads",
    nameKey:"source"
  }

export function LeadsGoalChart() {

    return (
      <ChartRadial
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }

