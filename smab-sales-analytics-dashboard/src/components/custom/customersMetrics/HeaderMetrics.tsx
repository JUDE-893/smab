"use client"

import { SectionCardsSkeleton } from "@/components/shadcnkit/section-cards-skeleton"
import { SectionCards } from "@/components/shadcnkit/section-cards"
import { getOrdersProducts } from '@/services/productServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'
import { roundToTwo, sortArrayByPrp } from "@/lib/utils";
import { useMemo } from "react"
import { log } from "console"

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
      ['orders-products', timeRange],
      async () => await getOrdersProducts(timeRange)
    );

    const metrics = useMemo(() => {
      
      return [
      // top revenue
      {
        title: <>{`${roundToTwo(data?.[0]?.revenue ?? 0)}`} <span className="text-sm text-muted-foreground">MAD</span></>,
        description: "Best Selling Record",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: `${data?.[0]?.barcode} - ${data?.[0]?.name}`,
      },
      // top quantity
      {
        title: `${sortArrayByPrp(data ?? [], "quantity")?.[0]?.quantity ?? 0 }`,
        description: "Most Selled Product",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: (() => {
          const {name , barcode} = sortArrayByPrp(data ?? [], "quantity")?.[0] ?? {};
          return `${barcode} - ${name}`
        })(),
      },
      // top fast moving
      {
        title: `${sortArrayByPrp(data ?? [], "order_frequency")?.[0]?.order_frequency ?? 0 }`,
        description: "Fastest Moving Product",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: (() => {
          const {name, barcode} = sortArrayByPrp(data ?? [], "order_frequency")?.[0] ?? {};
          return `${barcode} - ${name}`
        })(),
      },
      // total product sold
      {
        title: `${roundToTwo(data?.length ?? 0)}`,
        description: "Total Products",
        trendValue: 0,
        trendDirection: "up" as const,
        metricMessage: `Total Products Quantity Sold`,
      },
    ]}, [timeRange, data?.length])
    

    if (isLoading) return (<SectionCardsSkeleton />)

    return (
        <SectionCards metrics={metrics} error={error} />
    )
}
