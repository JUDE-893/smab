"use client"

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';



export function useTimeRange(): string {
  const searchParams = useSearchParams();
  const timeRange = searchParams.get('timeRange') ?? process.env.NEXT_PUBLIC_DEFAULT_TIMERANGE;

  const formattedRange = useMemo(() => {
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd');

    // Case 1: timeRange is a date range
    if (typeof timeRange === 'string' && timeRange.includes(',')) {
      return timeRange;
    }

    // Case 2: timeRange is a duration like "7d", "30d"
    const match = typeof timeRange === 'string' ? timeRange.match(/^(\d+)d$/) : null;
    if (match) {
      const days = parseInt(match[1], 10);
      const startDate = format(subDays(today, days), 'yyyy-MM-dd');
      return `${startDate},${formattedToday}`;
    }

    // Fallback to default
    const startDate = format(subDays(today, 30), 'yyyy-MM-dd');
    return `${startDate},${formattedToday}`;
  }, [timeRange]);

  return formattedRange;
}
