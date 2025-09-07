"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts"

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
import { MediumCardSkeleton } from '@/components/shadcnkit/med-card-skeleton'
import { DisplayErrorMessage } from '@/components/shadcnkit/error-message-display'


type ChartMetaData = {
  title: string;
  description: string;
  dataKey: string;
  nameKey: string
  posColor: string
  negColor: string
};

type ChartBarNegativeProps = {
  chartConfig: ChartConfig;
  chartMetaData: ChartMetaData;
  chartData: unknown[]
};

export function ChartBarNegative({
  chartConfig,
  chartMetaData,
  chartData
}: ChartBarNegativeProps) {


  return (<MediumCardSkeleton />)

  return (
    <Card className="h-60">
      <CardHeader>
        <CardTitle>{chartMetaData?.title}</CardTitle>
        <CardDescription>{chartMetaData?.description}</CardDescription>
      </CardHeader>
      {!chartMetaData?.error
        ? <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-40 w-full mt-[-15px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey={chartMetaData?.nameKey}>
              <LabelList position="top" dataKey={chartMetaData?.dataKey} fillOpacity={0.7} />
              {chartData.map((item) => (
                <Cell
                  key={item[chartMetaData?.dataKey]}
                  fill={item[chartMetaData?.nameKey] > 0 ? chartMetaData?.posColor : chartMetaData.negColor}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
          </CardContent>
        : <DisplayErrorMessage error={chartMetaData?.error} className=" h-25" />}
    </Card>
  )
}
