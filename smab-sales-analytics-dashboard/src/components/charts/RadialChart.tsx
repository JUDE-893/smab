"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
import { metadata } from "@/app/layout"



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

export function ChartRadial({
    chartConfig,
    chartMetaData,
    chartData
  }: RadarChartInteractiveProps) {

      const radialDataKeys = Object.keys(chartConfig);
  const totalVisitors = chartData[0][radialDataKeys[1]] + ' / '+ `${chartData[0][radialDataKeys[1]] + chartData[0][radialDataKeys[0]]}`

  return (
    <Card className="flex flex-col h-60">
      <CardHeader className="items-center pb-0">
        <CardTitle>{chartMetaData?.title}</CardTitle>
        <CardDescription>{chartMetaData?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-50 w-full"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl text-sm font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {chartMetaData?.dataKey}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            {radialDataKeys.map((k) => 
            <RadialBar
              key={k}
              dataKey={k.toLowerCase()}
              stackId="a"
              cornerRadius={5}
              fill={chartConfig[k]?.color}
              className="stroke-transparent stroke-2"
            />)}
            
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

    </Card>
  )
}
