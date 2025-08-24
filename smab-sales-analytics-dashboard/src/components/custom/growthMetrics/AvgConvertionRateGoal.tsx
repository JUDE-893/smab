import { AvgLineChart } from '@/components/charts/AvgLineChart';

const chartData = [
  { date: "2024-04-01", cnvRate: 186 },
  { date: "2024-04-02", cnvRate: 305 },
  { date: "2024-04-03", cnvRate: 237 },
  { date: "2024-04-04", cnvRate: 73 },
  { date: "2024-04-05", cnvRate: 209 },
  { date: "2024-04-06", cnvRate: 214 },
]

const chartConfig = {
  cnvRate: {
    label: "Convertion Rate",
    color: "var(--chart-2)",
  },
}

const chartMetaData = {
    title: "Convertion Rate Goal",
    description: 'Targeted convertion rate goal overview',
    dataKey:"cnvRate",
    nameKey:"Convertion Rate"
  }

export function AvgConvertionRateGoal() {

    return (
      <AvgLineChart
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }
