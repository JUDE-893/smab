"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartMetaData = {
  title: string;
  description: string;
  dataKey: string;
  nameKey?: string
};

type RadarChartInteractiveProps = {
  chartConfig: ChartConfig;
  chartMetaData: ChartMetaData;
  chartData: unknown[]
};

export function ChartRadar({
  chartConfig,
  chartMetaData,
  chartData
}: RadarChartInteractiveProps) {

  const radarDataKeys = Object.keys(chartConfig);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>{chartMetaData?.title}</CardTitle>
        <CardDescription>
          {chartMetaData?.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: -40,
              bottom: -10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey={chartMetaData?.dataKey} />
            <PolarGrid />

            { radarDataKeys.map((k, i) => {
                return <Radar
                dataKey={k?.toLowerCase()}
                fill={chartConfig[k?.toLowerCase()]?.color}
                fillOpacity={(i+1)/radarDataKeys?.length}
                key={i}
              />
            })
            }

            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
