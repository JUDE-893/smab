"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  title: string
  onDateChange: (dateRange: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ title, onDateChange, className }: DateRangePickerProps) {

  const [date, setDate] = React.useState<DateRange | undefined>()

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onDateChange(newDate)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          {title}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
