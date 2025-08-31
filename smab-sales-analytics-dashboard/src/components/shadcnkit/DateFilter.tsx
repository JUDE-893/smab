"use client"

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { DateRange as RDPDateRange } from 'react-day-picker'
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
import { useIsMobile } from "@/hooks/use-mobile"
import * as React from "react"
import { DatePickerButton } from './DatePickerButton';
import { formatDateRange } from '@/lib/utils';



export function DateFilter() {

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState(process.env.NEXT_PUBLIC_DEFAULT_TIMERANGE ?? "90d")

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL on mount
  React.useEffect(() => {
    const fromUrl = searchParams.get('timeRange')
    if (fromUrl && fromUrl !== timeRange) {
      setTimeRange(fromUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile]);

  function setCustomRange(date: RDPDateRange | undefined) {
    if (!date?.from || !date?.to) return
    const dr = formatDateRange({ from: date.from, to: date.to });
    setTimeRange(dr)
  }

  React.useEffect(() => {
    if (timeRange === '' || timeRange === 'custom' ) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('timeRange', timeRange)
    const url = `${pathname}?${params.toString()}`
    router.push(url)
  }, [pathname, router, searchParams, timeRange]);


  return (
    <>
    <ToggleGroup
      type="single"
      value={timeRange}
      onValueChange={setTimeRange}
      variant="outline"
      className="hidden *:data-[slot=toggle-group-item]:!px-4 @[760px]/card:flex"
    >
      <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
      <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
      <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
      <ToggleGroupItem value="custom"><DatePickerButton title='Other' onDateChange={setCustomRange} /></ToggleGroupItem>
    </ToggleGroup>
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger
        className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[760px]/card:hidden"
        size="sm"
        aria-label="Select a value"
      >
        <SelectValue placeholder="Last 3 months" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="7d" className="rounded-lg">
          Last 7 days
        </SelectItem>
        <SelectItem value="30d" className="rounded-lg">
          Last 30 days
        </SelectItem>
        <SelectItem value="90d" className="rounded-lg">
          Last 3 months
        </SelectItem>
      </SelectContent>
    </Select>
    </>
  );
}
