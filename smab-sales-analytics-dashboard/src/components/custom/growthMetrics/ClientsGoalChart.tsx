import { ChartRadial } from '@/components/charts/RadialChart';

const chartData = [{ month: "january", left: 18, achieved: 32 }]

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
    title: "New Clients Goal",
    description: 'Targeted new clients goal',
    dataKey:"Clients",
    nameKey:"source"
  }

export function ClientsGoalChart() {

    return (
      <ChartRadial
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }

