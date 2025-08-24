"use client"

import { useRouter } from 'next/navigation';
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



export function DateFilter() {

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile]);

  const router = useRouter();

  const updateFilter = () => {
    // Update query without losing existing queries
    router.push(
      {
        pathname: router.pathname, // Current path
        query: { ...router.query, 'data-filter': 'last-month' }, // Merge existing query with new param
      },
      undefined,
      { shallow: true } // Optional: enables shallow routing (no data refetch)
    );
  };

  return (
    <>
    <ToggleGroup
      type="single"
      value={timeRange}
      onValueChange={setTimeRange}
      variant="outline"
      className="hidden *:data-[slot=toggle-group-item]:!px-4 @[7670px]/card:flex"
    >
      <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
      <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
      <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
    </ToggleGroup>
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger
        className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[7670px]/card:hidden"
        size="sm"
        aria-label="Select a value"
      >
        <SelectValue placeholder="Last 3 months" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="90d" className="rounded-lg">
          Last 3 months
        </SelectItem>
        <SelectItem value="30d" className="rounded-lg">
          Last 30 days
        </SelectItem>
        <SelectItem value="7d" className="rounded-lg">
          Last 7 days
        </SelectItem>
      </SelectContent>
    </Select>
    </>
  );
}
