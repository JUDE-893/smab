"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { LargeCardSkeleton } from '@/components/shadcnkit/large-card-skeleton'
import { DisplayErrorMessage } from '@/components/shadcnkit/error-message-display'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ChartMetaData = {
  title: string;
  description: string;
  dataKey: string;
  nameKey?: string;
  hideX?: boolean;
  hideY?: boolean;
  toolTipLabel?: (value: any) => string;
  isLoading?: boolean;
  error?: any;
};

type HeatMapChartProps = {
  chartConfig: ChartConfig;
  chartMetaData: ChartMetaData;
  chartData: unknown[];
  className?: string;
  year?: number;
  weeksPerPage?: number;
};

export function HeatMapChart({
  chartConfig,
  chartMetaData,
  chartData,
  className,
  year = new Date().getFullYear(),
  weeksPerPage = 53 // Default to showing all weeks
}: HeatMapChartProps) {
  if (chartMetaData?.isLoading) return <LargeCardSkeleton />

  const chartKeys = Object.keys(chartConfig)
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    chartKeys?.[0] ?? 'default'
  )
  
  const [currentPage, setCurrentPage] = React.useState(0)

  // Generate all days of the year
  const generateYearDays = () => {
    const days = []
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    
    // Adjust start date to the nearest Sunday (GitHub starts weeks on Sunday)
    const startDay = startDate.getDay()
    const adjustedStartDate = new Date(startDate)
    adjustedStartDate.setDate(adjustedStartDate.getDate() - startDay)
    
    // Adjust end date to the nearest Saturday
    const endDay = endDate.getDay()
    const adjustedEndDate = new Date(endDate)
    adjustedEndDate.setDate(adjustedEndDate.getDate() + (6 - endDay))
    
    for (let date = new Date(adjustedStartDate); date <= adjustedEndDate; date.setDate(date.getDate() + 1)) {
      days.push({
        date: new Date(date),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        dayOfWeek: date.getDay(),
        weekOfYear: getWeekNumber(date)
      })
    }
    return days
  }

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Group days by weeks
  const groupDaysByWeeks = (days: any[]) => {
    const weeks: any[] = []
    let currentWeek: any[] = []
    
    days.forEach((day, index) => {
      if (index % 7 === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(day)
    })
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }
    
    return weeks
  }

  // Get all days, group by weeks, and calculate pagination
  const allDays = generateYearDays()
  const allWeeks = groupDaysByWeeks(allDays)
  const totalPages = Math.ceil(allWeeks.length / weeksPerPage)
  
  // Get current page weeks
  const startIndex = currentPage * weeksPerPage
  const endIndex = Math.min(startIndex + weeksPerPage, allWeeks.length)
  const currentWeeks = allWeeks.slice(startIndex, endIndex)

  // Get max value for color scaling
  const maxValue = Math.max(...chartData.map((d: any) => d[activeChart] || 0))

  // Day names for Y-axis
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Find data for a specific date
  const findDataForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return chartData.find((d: any) => 
      new Date(d[chartMetaData.dataKey]).toISOString().split('T')[0] === dateString
    )
  }

  return (
    <Card className={"py-0 " + className}>
      <CardHeader className={`flex flex-col items-stretch !p-0 sm:flex-row h-20 ${chartKeys?.length > 1 ? "border-b" : ""}`}>
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>{chartMetaData?.title}</CardTitle>
          <CardDescription>{chartMetaData?.description}</CardDescription>
        </div>
        {chartKeys?.length > 1 && (
          <div className="flex">
            {chartKeys.map((key) => {
              const chart = key as keyof typeof chartConfig
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </CardHeader>
      
      {!chartMetaData?.error ? (
        <CardContent className="h-50">
          <ChartContainer config={chartConfig} className="w-full">
            <div className="flex items-start gap-2">
              {/* Y-axis with day names */}
              <div className="flex flex-col justify-around h-[168px] py-0.5 text-xs text-muted-foreground">
                {dayNames.map((day, i) => (
                  <div key={i} className="h-5 flex items-center justify-end pr-2" style={{ width: '30px' }}>
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Heatmap grid */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-1">
                  {currentWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day: any, dayIndex: number) => {
                        const dataPoint = findDataForDate(day.date)
                        const value = dataPoint ? dataPoint[activeChart] : null
                        const hasData = !!dataPoint
                        
                        const intensity = hasData ? (value / maxValue) * 100 : 0
                        const color = hasData 
                          ? `color-mix(in srgb, ${chartConfig[activeChart].color} ${intensity}%, transparent)` 
                          : "var(--muted)"
                        
                        return (
                          <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="w-4 h-4 rounded-[2px] cursor-pointer"
                                  style={{ backgroundColor: color }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {hasData ? `${value} ${chartConfig[activeChart].label} on ${day.date.toLocaleDateString()}` : `No data on ${day.date.toLocaleDateString()}`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )
                      })}
                    </div>
                  ))}
                </div>
                
                {/* X-axis with month labels */}
                <div className="flex gap-1 mt-2 text-xs text-muted-foreground">
                  {currentWeeks.map((week, weekIndex) => {
                    // Only show month label for the first week of each month
                    const firstDay = week[0]
                    const showMonth = firstDay && firstDay.date.getDate() <= 7
                    
                    return (
                      <div key={weekIndex} className="w-4 text-center">
                        {showMonth && (
                          <span>{firstDay.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </ChartContainer>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} of {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      ) : (
        <DisplayErrorMessage error={chartMetaData?.error} className="h-64" />
      )}
    </Card>
  )
}