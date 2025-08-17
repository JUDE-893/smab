import { MonoPieChart } from '@/components/charts/MonoPieChart';

const chartData = [
  { source: "chrome", leads: 275, fill: "var(--color-chrome)" },
  { source: "safari", leads: 200, fill: "var(--color-safari)" },
  { source: "firefox", leads: 187, fill: "var(--color-firefox)" },
  { source: "edge", leads: 173, fill: "var(--color-edge)" },
  { source: "other", leads: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  leads: {
    label: "Leads",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
}

const chartMetaData = {
  title: "Leads Source",
  description: 'Metrics of the most attacting marketing sources',
  dataKey:"leads",
  nameKey:"source"
}
export function LeadSourceChart() {

  return (
    <MonoPieChart
      chartMetaData={chartMetaData}
      chartConfig={chartConfig}
      chartData={chartData}
     />
  )
}
