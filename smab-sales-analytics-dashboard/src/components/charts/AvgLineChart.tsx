"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"



type ChartMetaData = {
  title: string;
  description: string;
  dataKey: string;
  nameKey?: string
};

type AvgLineChartProps = {
  chartConfig: ChartConfig;
  chartMetaData: ChartMetaData;
  chartData: unknown[]
};

export function AvgLineChart({
  chartConfig,
  chartMetaData,
  chartData
}: AvgLineChartProps) {

  const averageDesktop = 80

  return (
    <Card className='h-60' >
      <CardHeader>
        <CardTitle>{chartMetaData?.title}</CardTitle>
        <CardDescription>{chartMetaData?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-40 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={chartMetaData?.dataKey}
                  labelFormatter={(value) => {
                    console.log("DD", value);

                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line dataKey={chartMetaData?.dataKey} type="linear" stroke={chartConfig[chartMetaData?.dataKey]?.color} strokeWidth={2} dot={false} />
            <ReferenceLine
              y={180}
              stroke="#FF6B00"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "80% Peak",
                position: "topRight",
                fill: "#FF6B00",
                fontSize: 10,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
