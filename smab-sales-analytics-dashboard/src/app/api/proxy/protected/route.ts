import { NextResponse } from 'next/server';
import { headersToObject } from '@/lib/requestHelpers';
import { auth } from "@/auth";
import { decryptJWT } from '@/lib/cryptoHelpers'

export async function POST(request: Request) {
  const headersObj = headersToObject(request);
  const { target, data } = await request.json();

  const session = await auth();

  // decrypt token back
  console.log("RRRR____________________", session.user.data.token);
  const jwt = await decryptJWT('session', session.user.data.token, process.env.JWT_ENCRYPTION_SECRET);

  console.log("TTTT____________________", jwt);


  const fetchOptions: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      ...headersObj,
      "content-type": 'application/json'
    }
  };

  // Only add body if data exists and is truthy
  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  let response = await fetch(`${process.env.BACKEND_API_BASE_URL}/${target}`, fetchOptions);
  const responseData = await response.json();
  console.log('[PR RESPONSE]', responseData);

  return NextResponse.json(responseData);
}
