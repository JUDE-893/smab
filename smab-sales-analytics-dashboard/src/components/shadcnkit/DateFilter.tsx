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

const filters = {
  '1d': "Today",
  '7d': "Last 7 days",
  '30d': 'Last 30 days',
  '90d': 'Last 3 months',
  '180d': 'Last 6 months',
  '365d': 'Last year',
  'all': 'All time',
}


export function DateFilter() {
  const isMobile = useIsMobile()
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get timeRange directly from URL
  const timeRange = searchParams.get('timeRange') || process.env.NEXT_PUBLIC_DEFAULT_TIMERANGE || "90d";

  const setTimeRange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('timeRange', value);
    const url = `${pathname}?${params.toString()}`;
    router.push(url);
  };

  function setCustomRange(date: RDPDateRange | undefined) {
    if (!date?.from || !date?.to) return
    const dr = formatDateRange({ from: date.from, to: date.to });
    setTimeRange(dr)
  }

  React.useEffect(() => {
    if (isMobile && timeRange !== "7d") {
      setTimeRange("7d");
    }
  }, [isMobile]);

  return (
    <>
    <ToggleGroup
      type="single"
      value={timeRange}
      onValueChange={setTimeRange}
      variant="outline"
      className="hidden *:data-[slot=toggle-group-item]:!px-4 @[760px]/card:flex"
    >

        {
          Object.keys(filters)?.splice(0,3)?.map((flt) =>
            <ToggleGroupItem value={flt}>{filters[flt]}</ToggleGroupItem>)
        }

        <ToggleGroupItem value="custom"><DatePickerButton title='Custom' onDateChange={setCustomRange} /></ToggleGroupItem>
        <ToggleGroupItem className="w-60" >
          <Select value={timeRange} onValueChange={(vl) => {Object.keys(filters)?.splice(3,).includes(vl) && setTimeRange(vl)}}>
            <SelectTrigger
              className="border-none w-30"
              size="sm"
              aria-label="Select a value"
            >
              {Object.keys(filters)?.splice(3,).includes(timeRange) ? filters[timeRange] : "Other"}
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {
                  Object.keys(filters)?.splice(3,).map((flt) =>
                    <SelectItem value={flt} className="rounded-lg">{filters[flt]}</SelectItem>
                )
                }
              </SelectContent>
          </Select>
        </ToggleGroupItem>

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
        {
          Object.keys(filters).map((flt) =>
            <SelectItem value={flt} className="rounded-lg">{filters[flt]}</SelectItem>
        )
        }
        <SelectItem value="custom" className="rounded-lg">
          <DatePickerButton title='Other' onDateChange={setCustomRange} />
        </SelectItem>
      </SelectContent>
    </Select>
    </>
  );
}
