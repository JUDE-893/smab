import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


type DateRange = {
  from: Date;
  to: Date;
};

/**
 * Converts a date range to 'yyyy-mm-dd,yyyy-mm-dd' format
 * @param range - Object with `from` and `to` Date values
 * @returns A string like '2025-07-30,2025-08-30'
 */
export function formatDateRange(range: DateRange): string {
  const fromStr = format(range.from, 'yyyy-MM-dd');
  const toStr = format(range.to, 'yyyy-MM-dd');
  return `${fromStr},${toStr}`;
}

// 30748.079999999998 -> 30748.08
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
