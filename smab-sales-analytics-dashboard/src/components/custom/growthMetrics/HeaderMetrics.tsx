import { SectionCards } from "@/components/shadcnkit/section-cards"

const metrics = [
    {
      title: "250",
      description: "Total New Leads",
      trendValue: 12.5,
      trendDirection: "up" as const,
      metricMessage: "Trending up this month",
    },
    {
      title: "35",
      description: "Total New Clients",
      trendValue: -7.1,
      trendDirection: "down" as const,
      metricMessage: "Steady performance increase",
    },

    {
      title: "-4.3%",
      description: "Conversion Rate",
      trendValue: -4.3,
      trendDirection: "down" as const,
      metricMessage: "Poor client convertion rate",
    },
    {
      title: "0.00",
      description: "PlaceHolder section",
      trendValue: 0,
      trendDirection: "up" as const,
      metricMessage: "Poor client convertion rate",
    }
  ]

export function HeaderMetrics() {
    return (
        <SectionCards metrics={metrics} /> 
    )
}