import { auth } from '@/auth'
import { NextResponse } from 'next/server';


export const withAuth = async (request) => {
  const authRes = await auth();

  if (!authRes) return NextResponse.redirect(new URL('/login', request.url),{status: authRes?.status || 307});
}
