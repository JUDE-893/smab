import { NextResponse } from 'next/server';
import { headersToObject } from '@/lib/requestHelpers';

export async function GET(request: Request) {

  const headersObj = headersToObject(request);

  let response = await fetch(process.env.BACKEND_API_BASE_URL+"/test", {
    method: 'GET',
    headers: {
      ...headersObj,
      "content-type": 'application/json'
    }
  })

  console.log('[TEST RESPONSE]', response);

  // Return headers as JSON
  return NextResponse.json(response);
}
