"use client"

import { SectionCardsSkeleton } from "@/components/shadcnkit/section-cards-skeleton"
import { SectionCards } from "@/components/shadcnkit/section-cards"
import { getCustomersMetrics } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'
import { roundToTwo, sortArrayByPrp } from "@/lib/utils";
import { useMemo } from "react"

// const metrics = [
//     {
//       title: "$7500",
//       description: "Total Sales Value",
//       trendValue: 12.5,
//       trendDirection: "up" as const,
//       metricMessage: "Trending up this month",
//     },
//     {
//       title: "$3500",
//       description: "Best Selling Record",
//       trendValue: 0.0,
//       trendDirection: "up" as const,
//       metricMessage: "Sensationnal performance by Agent4",
//     },

//     {
//       title: "5.3%",
//       description: "Average Order Per Agent",
//       trendValue: -0.3,
//       trendDirection: "down" as const,
//       metricMessage: "Poor client convertion rate",
//     },
//     {
//       title: "4.1",
//       description: "Total client per agent",
//       trendValue: 1,
//       trendDirection: "up" as const,
//       metricMessage: "Steady client convertion rate",
//     }
//   ]

export function HeaderMetrics() {

    const timeRange = useTimeRange();


    const { data, isLoading, error } = useCustomQuery(
      ['customers-metrics', timeRange],
      async () => await getCustomersMetrics(timeRange)
    );

    const metrics = useMemo(() => {
      
      return [
      // top revenue
      {
        title: <>{`${roundToTwo(data?.[0]?.revenue ?? 0)}`} <span className="text-sm text-muted-foreground">MAD</span></>,
        description: "Best Selling Record",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: `Made with ${data?.[0]?.customer_name}`,
      },
      // top quantity
      {
        title: `${data?.length ?? 0}`,
        description: "Customers Number",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: 'Number of customer this periode',
      },
      // top fast moving
      {
        title: `${sortArrayByPrp(data ?? [], "order_count")?.[0]?.order_count ?? 0 }`,
        description: "Frequant Customer",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: (() => {
          const {customer_name} = sortArrayByPrp(data ?? [], "order_count")?.[0] ?? {};
          return `${customer_name}`
        })(),
      },
      // total product sold
      {
        title: `${sortArrayByPrp(data ?? [], "quantity")?.[0]?.quantity ?? 0 }`,
        description: "Mass Consuming Customer",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: (() => {
          const {customer_name} = sortArrayByPrp(data ?? [], "quantity")?.[0] ?? {};
          return `${customer_name} - most product quantity`
        })(),
      },
    ]}, [timeRange, data?.length])
    

    if (isLoading) return (<SectionCardsSkeleton />)

    return (
        <SectionCards metrics={metrics} error={error} />
    )
}
