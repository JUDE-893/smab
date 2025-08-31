"use client"

import { SectionCards } from "@/components/shadcnkit/section-cards"
import { getSalesHeaderMetrics } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

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

    const timeRange = useTimeRange();


    const { data, isLoading } = useCustomQuery(
      ['sales-header-metrics',timeRange],
      async () => await getSalesHeaderMetrics(timeRange)
    )

    return (
        <SectionCards metrics={data} />
    )
}
