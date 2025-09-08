import { ChartBarNegative } from '@/components/charts/ChartBarNegative';

const chartData = [
  { date: "2024-04-01", cnvRate: 186 },
  { date: "2024-04-02", cnvRate: 205 },
  { date: "2024-04-03", cnvRate: -207 },
  { date: "2024-04-04", cnvRate: 173 },
  { date: "2024-04-05", cnvRate: -209 },
  { date: "2024-04-06", cnvRate: 214 },
]

const chartConfig = {
  cnvRate: {
    label: "Convertion Rate",
  },
}

const chartMetaData = {
    title: "Convertion Rate Goal",
    description: 'Targeted convertion rate goal overview',
    dataKey:"date",
    nameKey:"cnvRate",
    posColor: "var(--chart-2)",
    negColor: "var(--destructive)"
  }

export function AvgConvertionRateGoal() {

    return (
      <ChartBarNegative
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }
