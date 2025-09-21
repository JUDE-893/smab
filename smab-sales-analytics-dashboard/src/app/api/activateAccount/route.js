import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {

  cookies().set('session', 'body.sessionId', {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24, // 1 day
});

  return NextResponse.redirect(new URL('/unverified-account', request.url), {status: 307});
}
