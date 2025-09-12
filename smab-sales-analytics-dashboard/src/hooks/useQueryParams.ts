'use client'

import { useSearchParams } from 'next/navigation'

export function useQueryParams() {
  const searchParams = useSearchParams()

  const query: Record<string, string | boolean> = {}

  for (const [key, value] of searchParams.entries()) {
    // Convert "true"/"false" strings to actual booleans
    if (value === 'true') {
      query[key] = true
    } else if (value === 'false') {
      query[key] = false
    } else {
      query[key] = value
    }
  }

  return query
}
