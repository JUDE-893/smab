"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { DataExportButtons } from "@/components/shadcnkit/DataExportButtons"
import { exportDataConfig } from "@/components/config/salesCompos/areaChartConfig"
import { LargeCardSkeleton } from '@/components/shadcnkit/large-card-skeleton'
import { DisplayErrorMessage } from '@/components/shadcnkit/error-message-display'


type ChartMetaData = {
  title: string;
  description: string;
  dataKey: string;
  nameKey?: string
};

type PieChartInteractiveProps = {
  chartConfig: ChartConfig;
  chartMetaData: ChartMetaData;
  chartData: unknown[]
};


export function ChartAreaInteractive({
    chartConfig,
    chartMetaData,
    chartData
  }: PieChartInteractiveProps) {

  if (chartMetaData?.isLoading) return <LargeCardSkeleton />

  const chartDataKeys = Object.keys(chartConfig).splice(1);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{chartMetaData?.title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {chartMetaData?.description}
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <DataExportButtons data={chartData} exportDataConfig={exportDataConfig} />
        </CardAction>
      </CardHeader>
      {!chartMetaData?.error
        ? <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="flex flex flex-row aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
            {chartDataKeys?.map( (k) =>
              <defs key={k}>
                <linearGradient id={k} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig[k.toLowerCase()]?.color}
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[k.toLowerCase()]?.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
            )}

            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={chartMetaData?.dataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {chartDataKeys?.map( (k) =>
            <Area
              key={k}
              dataKey={k.toLowerCase()}
              type="natural"
              fill={`url(#${k})`}
              stroke={`${chartConfig[chartDataKeys[0]]?.color}`}
              stackId="a"
            />
            )}

          </AreaChart>
        </ChartContainer>

          </CardContent>
        : <DisplayErrorMessage error={chartMetaData?.error} className=" h-64" />
    }
    </Card>
  )
}
