import { HorizentalChartBar } from '@/components/charts/HorizentalBarChart';


const chartData = [
    { agent: "agent1", sales: 275, fill: "var(--color-agent1)" },
    { agent: "agent2", sales: 200, fill: "var(--color-agent2)" },
    { agent: "agent3", sales: 187, fill: "var(--color-agent3)" },
    { agent: "agent4", sales: 173, fill: "var(--color-agent4)" },
    { agent: "agent5", sales: 90, fill: "var(--color-agent5)" },
  ]
  
  const chartConfig = {
    sales: {
      label: "Sales Value",
    },
    agent1: {
      label: "Agent-1",
      color: "oklch(38.1% 0.176 304.987)",
    },
    agent2: {
      label: "Agent-2",
      color: "oklch(43.8% 0.218 303.724)",
    },
    agent3: {
      label: "Agent-3",
      color: "oklch(49.6% 0.265 301.924)",
    },
    agent4: {
      label: "Agent-4",
      color: "oklch(62.7% 0.265 303.9)",
    },
    agent5: {
      label: "Agent-5",
      color: "oklch(71.4% 0.203 305.504)",
    },
  } 

  const chartMetaData = {
    title: "Conversion Overview",
    description: 'Metrics overview of leads conversion rate',
    dataKey:"sales",
    nameKey:"agent"
  }

export function AgentsSalesValue() {

    return (
      <HorizentalChartBar
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }
