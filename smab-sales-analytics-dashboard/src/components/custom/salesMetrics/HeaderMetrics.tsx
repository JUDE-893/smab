"use client"

import { SectionCardsSkeleton } from "@/components/shadcnkit/section-cards-skeleton"
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


    const { data, isLoading, error } = useCustomQuery(
      ['sales-header-metrics',timeRange],
      async () => await getSalesHeaderMetrics(timeRange)
    )

    if (isLoading) return (<SectionCardsSkeleton />)

    const metrics = [
                      {
                        title: <>{data['total_sales_value']}<span className="text-sm ml-1 text-muted-foreground">MAD</span></>,
                        description: 'Total Sales Value',
                        trendValue: 0,
                        trendDirection: 'up',
                        metricMessage: 'Sales revenue in this periode'
                      },
                      {
                        title: <>{data['best_selling_record']}<span className="text-sm ml-1 text-muted-foreground">MAD</span></>,
                        description: 'Best Selling Record',
                        trendValue: 0,
                        trendDirection: 'up',
                        metricMessage: data['best_selling_sgent'] ? `Top agent: ${data['best_selling_sgent']}` : 'Top agent: Unknown'
                      },
                      {
                        title: data['total_orders'],
                        description: 'Total Orders',
                        trendValue: 0,
                        trendDirection: 'up',
                        metricMessage: 'Sales orders made'
                      },
                      {
                        title: data['average_order_per_agent'],
                        description: 'Average Order Per Agent',
                        trendValue: 0,
                        trendDirection: 'up',
                        metricMessage: 'Order made by sales agent'
                      }
                    ];

    return (
        <SectionCards metrics={metrics} error={error} />
    )
}
