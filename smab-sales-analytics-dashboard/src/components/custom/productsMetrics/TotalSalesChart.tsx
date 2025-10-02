"use client"

import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive"
import { getSalesMetricsPerDay } from '@/services/salesServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

const chartData = [
    { date: "2024-04-01", sales: 222 },
    { date: "2024-04-02", sales: 97 },
    { date: "2024-04-03", sales: 167 },
    { date: "2024-04-04", sales: 242 },
    { date: "2024-04-05", sales: 373 },
    { date: "2024-04-06", sales: 301 },
    { date: "2024-04-07", sales: 245 },
    { date: "2024-04-08", sales: 409 },
    { date: "2024-04-09", sales: 59 },
    { date: "2024-04-10", sales: 261 },
    { date: "2024-04-11", sales: 327 },
    { date: "2024-04-12", sales: 292 },
    { date: "2024-04-13", sales: 342 },
    { date: "2024-04-14", sales: 137 },
    { date: "2024-04-15", sales: 120 },
    { date: "2024-04-16", sales: 138 },
    { date: "2024-04-17", sales: 446 },
    { date: "2024-04-18", sales: 364 },
    { date: "2024-04-19", sales: 243 },
    { date: "2024-04-20", sales: 89 },
    { date: "2024-04-21", sales: 137 },
    { date: "2024-04-22", sales: 224 },
    { date: "2024-04-23", sales: 138 },
    { date: "2024-04-24", sales: 387 },
    { date: "2024-04-25", sales: 215 },
    { date: "2024-04-26", sales: 75 },
    { date: "2024-04-27", sales: 383 },
    { date: "2024-04-28", sales: 122 },
    { date: "2024-04-29", sales: 315 },
    { date: "2024-04-30", sales: 454 },
    { date: "2024-05-01", sales: 165 },
    { date: "2024-05-02", sales: 293 },
    { date: "2024-05-03", sales: 247 },
    { date: "2024-05-04", sales: 385 },
    { date: "2024-05-05", sales: 481 },
    { date: "2024-05-06", sales: 498 },
    { date: "2024-05-07", sales: 388 },
    { date: "2024-05-08", sales: 149 },
    { date: "2024-05-09", sales: 227 },
    { date: "2024-05-10", sales: 293 },
    { date: "2024-05-11", sales: 335 },
    { date: "2024-05-12", sales: 197 },
    { date: "2024-05-13", sales: 197 },
    { date: "2024-05-14", sales: 448 },
    { date: "2024-05-15", sales: 473 },
    { date: "2024-05-16", sales: 338 },
    { date: "2024-05-17", sales: 499 },
    { date: "2024-05-18", sales: 315 },
    { date: "2024-05-19", sales: 235 },
    { date: "2024-05-20", sales: 177 },
    { date: "2024-05-21", sales: 82 },
    { date: "2024-05-22", sales: 81 },
    { date: "2024-05-23", sales: 252 },
    { date: "2024-05-24", sales: 294 },
    { date: "2024-05-25", sales: 201 },
    { date: "2024-05-26", sales: 213 },
    { date: "2024-05-27", sales: 420 },
    { date: "2024-05-28", sales: 233 },
    { date: "2024-05-29", sales: 78 },
    { date: "2024-05-30", sales: 340 },
    { date: "2024-05-31", sales: 178 },
    { date: "2024-06-01", sales: 178 },
    { date: "2024-06-02", sales: 470 },
    { date: "2024-06-03", sales: 103 },
    { date: "2024-06-04", sales: 439 },
    { date: "2024-06-05", sales: 88 },
    { date: "2024-06-06", sales: 294 },
    { date: "2024-06-07", sales: 323 },
    { date: "2024-06-08", sales: 385 },
    { date: "2024-06-09", sales: 438 },
    { date: "2024-06-10", sales: 155 },
    { date: "2024-06-11", sales: 92 },
    { date: "2024-06-12", sales: 492 },
    { date: "2024-06-13", sales: 81 },
    { date: "2024-06-14", sales: 426 },
    { date: "2024-06-15", sales: 307 },
    { date: "2024-06-16", sales: 371 },
    { date: "2024-06-17", sales: 475 },
    { date: "2024-06-18", sales: 107 },
    { date: "2024-06-19", sales: 341 },
    { date: "2024-06-20", sales: 408 },
    { date: "2024-06-21", sales: 169 },
    { date: "2024-06-22", sales: 317 },
    { date: "2024-06-23", sales: 480 },
    { date: "2024-06-24", sales: 132 },
    { date: "2024-06-25", sales: 141 },
    { date: "2024-06-26", sales: 434 },
    { date: "2024-06-27", sales: 448 },
    { date: "2024-06-28", sales: 149 },
    { date: "2024-06-29", sales: 103 },
    { date: "2024-06-30", sales: 446 },
  ]

const chartConfig = {
  visitors : {
    label: "Sales",
  },
  sales: {
    label: "Sales",
    color: "var(--primary)",
  },

}

const chartMetaData = {
    title : "Total Sales",
    description: 'metrics of total sales values',
    dataKey: "date"

  }

export function TotalSalesChart() {

  const timeRange = useTimeRange();


  const { data, isLoading, error } = useCustomQuery(
    ['total-sales-metrics-per-day',timeRange],
    async () => await getSalesMetricsPerDay(timeRange)
  )


    return (
      <ChartAreaInteractive
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data?.salesMetricsPerDay}
        id="export-sales-as-excel"
       />
    )
  }
