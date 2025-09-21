import type { NextRequest } from 'next/server'

export function headersToObject(request: NextRequest) {
  // Define the headers we want to keep
  const allowedHeaders = [
    'user-agent',
    'x-auth-return-redirect',
    'x-forwarded-for',
    'x-forwarded-host',
    'x-forwarded-port',
    'x-forwarded-proto'
  ];

  // Convert only allowed headers to a plain object
  const headersObj: Record<string, string> = {};

  for (const [key, value] of request.headers.entries()) {
    if (allowedHeaders.includes(key.toLowerCase())) {
      headersObj[key] = value;
    }
  }

  return headersObj;
}
