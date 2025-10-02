import { NextResponse } from 'next/server';
import { headersToObject } from '@/lib/requestHelpers';
import { getToken } from 'next-auth/jwt';
import { decryptJWT } from '@/lib/cryptoHelpers';

export async function POST(request: Request) {
  const headersObj = headersToObject(request);
  const { target, data } = await request.json();

  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log("session?.accessToken", session?.accessToken);

  const token = await await decryptJWT(session?.accessToken, process.env.JWT_ENCRYPTION_SECRET);

  const fetchOptions: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      ...headersObj,
      "content-type": 'application/json',
      "authorization": `Bearier ${token}`
    }
  };

  // Add body for POST Request
  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  const response = await fetch(`${process.env.BACKEND_API_BASE_URL}/${target}`, fetchOptions);


  const responseData = await response.json();


  return NextResponse.json(responseData);
}
