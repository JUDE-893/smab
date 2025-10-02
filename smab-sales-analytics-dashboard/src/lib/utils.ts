import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

  /**
   *  getCapChars("johny Deep")                     // "JD"
   *  getCapChars("johny AL Deep")                  // "JD"
   *  getCapChars("@#johny")                        // "J"
   *  getCapChars("johny 1999")                     // "J"
   *  getCapChars("johny maria fernando Gonzalez")  // "JF"
   * @param {string} text - The input string to extract initials from.
   * @returns {string} - The extracted initials (1 or 2 characters).
   */
export function getCapChars(text) {
  // Replace non-letters with spaces, then split
  const words = text.replace(/[^a-zA-Z\s]/g, " ").split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";

  // Always take the first letter of the first word
  let result = words[0][0].toUpperCase();

  // If more than one valid word, also take the first letter of the last word
  if (words.length > 1) {
    result += words[words.length - 1][0].toUpperCase();
  }

  return result;
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

/**
 * Sorts an array of objects by a given property name.
 * @param {Array} data - The array to sort.
 * @param {string} prp - The property name to sort by.
 * @param {string} [direction='desc'] - Sort direction: 'asc' or 'desc'.
 * @returns {Array} - A new sorted array.
 * @throws {Error} - If property name is invalid or direction is invalid.
 */
export function sortArrayByPrp(data, prp, direction = 'desc') {
  if (!Array.isArray(data)) {
    throw new Error("First argument must be an array");
  }
  if (typeof prp !== 'string' || prp.trim() === '') {
    throw new Error("Property name must be a non-empty string");
  }
  if (!['asc', 'desc'].includes(direction.toLowerCase())) {
    throw new Error("Direction must be either 'asc' or 'desc'");
  }
  if (data.length > 0 && !(prp in data[0])) {
    throw new Error(`Property "${prp}" does not exist in array items`);
  }

  return [...data].sort((a, b) => {
    const valA = a[prp];
    const valB = b[prp];

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
};

export const formatPrice = (price: number | null, currencyStyle) => {
  if (price === null) return "Unknown"
  try {
    const formatted = new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return `${formatted}`;
  } catch {
    return `${price ?? 0}`;
  }
};
