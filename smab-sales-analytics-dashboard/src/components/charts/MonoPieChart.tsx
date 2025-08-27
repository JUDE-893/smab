"use client"


import { TrendingUp } from "lucide-react"
import { Pie, Cell, PieChart, Legend, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

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

export function MonoPieChart({
  chartConfig,
  chartMetaData,
  chartData
}: PieChartInteractiveProps) {

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{chartMetaData?.title}</CardTitle>
        <CardDescription>{chartMetaData?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey={chartMetaData.dataKey}
              nameKey={chartMetaData.nameKey}
              cx="50%"
              cy="60%"
              innerRadius={70}
              outerRadius={90}
              strokeWidth={2}
              paddingAngle={5}

              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 12} />
              )}


            >
            {true && chartData.map((entry) => (
                <Cell key={entry.source} fill={entry.fill}  cursor="pointer" />
              ))}
            </Pie>
            <Legend
              iconSize={11}
              iconType="square"
              layout="vertical"
              verticalAlign="bottom"
              align="right"
              wrapperStyle={{
                fontSize: "11px",
                display: "flex",
                flexDirection: "row",
                gap: "50px", // spacing between legend items
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
