import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Utility to get client IP
function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return req.ip ?? '' // may be undefined locally
}

export function forwardUserIdentity(req: NextRequest) {
  const ip = getClientIp(req)
  const ua = req.headers.get('user-agent') || '';

  // Clone request headers and append IP/UA
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('X-Forwarded-For', ip)
  requestHeaders.set('X-Real-IP', ip)
  requestHeaders.set('User-Agent', ua)
  requestHeaders.set('X-TEST', "**********************************************")

  // Continue to API route with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
