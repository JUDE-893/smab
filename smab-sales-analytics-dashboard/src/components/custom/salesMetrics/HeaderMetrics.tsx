import { SectionCards } from "@/components/shadcnkit/section-cards"

const metrics = [
    {
      title: "$7500",
      description: "Total Sales Value",
      trendValue: 12.5,
      trendDirection: "up" as const,
      metricMessage: "Trending up this month",
    },
    {
      title: "$3500",
      description: "Best Selling Record",
      trendValue: 0.0,
      trendDirection: "up" as const,
      metricMessage: "Sensationnal performance by Agent4",
    },

    {
      title: "5.3%",
      description: "Average Order Per Agent",
      trendValue: -0.3,
      trendDirection: "down" as const,
      metricMessage: "Poor client convertion rate",
    },
    {
      title: "4.1",
      description: "Total client per agent",
      trendValue: 1,
      trendDirection: "up" as const,
      metricMessage: "Steady client convertion rate",
    }
  ]

export function HeaderMetrics() {
    return (
        <SectionCards metrics={metrics} /> 
    )
}