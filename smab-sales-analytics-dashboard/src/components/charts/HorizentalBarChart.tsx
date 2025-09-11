"use client"

import { useState, useMemo } from "react"
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
import { LargeCardSkeleton } from '@/components/shadcnkit/large-card-skeleton'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ChartMetaData = {
  title: string;
  description: string;
  dataKey: string;
  nameKey: string;
  isLoading?: boolean;
  error?: any;
  hideLabel?: boolean;
  hideX?: boolean;
  hideY?: boolean;
};

type HorizentalChartBarProps = {
  chartConfig: ChartConfig;
  chartMetaData: ChartMetaData;
  chartData: unknown[];
  itemsPerPage?: number;
};

export function HorizentalChartBar({
  chartConfig,
  chartMetaData,
  chartData,
  itemsPerPage = 10
}: HorizentalChartBarProps & { itemsPerPage?: number }) {
  const [currentPage, setCurrentPage] = useState(1)

  // Sort data by dataKey in descending order (biggest first)
  const sortedData = useMemo(() => {
    if (!chartData || !chartMetaData.dataKey) return []
    return [...chartData].sort((a: any, b: any) => 
      b[chartMetaData.dataKey] - a[chartMetaData.dataKey]
    )
  }, [chartData, chartMetaData.dataKey])

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  if (chartMetaData?.isLoading) return <LargeCardSkeleton />

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{chartMetaData.title}</CardTitle>
        <CardDescription>
          {chartMetaData.description}
        </CardDescription>
      </CardHeader>
      
      {!chartMetaData?.error ? (
        <>
          <CardContent>
            <ChartContainer 
              config={chartConfig} 
              className="flex flex-row aspect-auto h-[340px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={paginatedData}
                layout="vertical"
                margin={{ left: 0 }}
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
                    chartConfig[value as keyof typeof chartConfig]?.label || value
                  }
                />
                <XAxis 
                  dataKey={chartMetaData.dataKey} 
                  type="number" 
                  hide={chartMetaData?.hideX ?? true} 
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel={chartMetaData?.hideLabel ?? false} />}
                />
                <Bar 
                  dataKey={chartMetaData.dataKey} 
                  layout="vertical" 
                  radius={0} 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {/* Pagination controls */}
            {sortedData.length > itemsPerPage && (
              <div className="flex items-center justify-between w-full mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                {sortedData.length > itemsPerPage && (
                  <span className="block mt-1 text-xs text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length} items
                  </span>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
            
            <div className="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </>
      ) : (
        <DisplayErrorMessage error={chartMetaData?.error} className="h-64" />
      )}
    </Card>
  )
}