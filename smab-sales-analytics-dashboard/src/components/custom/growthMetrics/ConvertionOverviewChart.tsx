import { ChartRadar } from '@/components/charts/RadarChart'

const chartData = [
  { month: "January", leads: 186, clients: 80 },
  { month: "February", leads: 305, clients: 200 },
  { month: "March", leads: 237, clients: 120 },
  { month: "April", leads: 73, clients: 190 },
  { month: "May", leads: 209, clients: 130 },
  { month: "June", leads: 214, clients: 140 },
]

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-1)",
  },
  clients: {
    label: "New client",
    color: "var(--chart-2)",
  },
} 

const chartMetaData = {
  title: "Conversion Overview",
  description: 'Metrics overview of leads conversion rate',
  dataKey:"month",
  nameKey:"source"
}


export function ConvertionOverviewChart() {

  return (
    <ChartRadar 
      chartMetaData={chartMetaData}
      chartConfig={chartConfig}
      chartData={chartData} 
    />
  )
}
