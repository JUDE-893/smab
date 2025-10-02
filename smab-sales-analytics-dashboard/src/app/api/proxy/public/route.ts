import { NextResponse } from 'next/server';
import { headersToObject } from '@/lib/requestHelpers';

export async function POST(request: Request) {
  const headersObj = headersToObject(request);
  const { target, data } = await request.json();

  const fetchOptions: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      ...headersObj,
      "content-type": 'application/json'
    }
  };

  // Add body for POST Request
  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  let response = await fetch(`${process.env.BACKEND_API_BASE_URL}/${target}`, fetchOptions);
  console.log("[R]", `${process.env.BACKEND_API_BASE_URL}/${target}`, fetchOptions.body,"____________", response);

  const responseData = await response.json();
  console.log('[PR RESPONSE]', responseData);

  return NextResponse.json(responseData);
}
