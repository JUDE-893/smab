"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DisplayErrorMessage } from '@/components/shadcnkit/error-message-display'



type ChartMetaData = {
    title: string;
    description: string;
    dataKey: string;
    nameKey: string
  };

  type HorizentalChartBarProps = {
    chartConfig: ChartConfig;
    chartMetaData: ChartMetaData;
    chartData: unknown[]
  };
import { LargeCardSkeleton } from '@/components/shadcnkit/large-card-skeleton'

export function HorizentalChartBar({
    chartConfig,
    chartMetaData,
    chartData
  }: HorizentalChartBarProps) {


  if (chartMetaData?.isLoading) return <LargeCardSkeleton />

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{chartMetaData.title}</CardTitle>
        <CardDescription>{chartMetaData.description}</CardDescription>
      </CardHeader>
      {!chartMetaData?.error ? <>
          <CardContent>
          <ChartContainer config={chartConfig} className="flex flex flex-row aspect-auto h-[340px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
              }}
              maxBarSize={60}
            >
              <YAxis
                dataKey={chartMetaData.nameKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide={chartMetaData?.hideY ?? false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <XAxis dataKey={chartMetaData.dataKey} type="number" hide={chartMetaData?.hideX ?? true } />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel={chartMetaData?.hideLabel ?? false } />}
              />
              <Bar dataKey={chartMetaData.dataKey} layout="horizental" radius={0} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </>
      : <DisplayErrorMessage error={chartMetaData?.error} className=" h-64" />
    }
    </Card>
  )
}
