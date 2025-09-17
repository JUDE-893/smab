import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from "next/headers";

export async function verifiedRestrict(req) {

  const verifiedCookie = cookies().get("vertkn");
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let tverified = verifiedCookie?.value === token.data?.token?.slice(0,32);

  if (!token || !token?.data?.user?.verifiedAt) {
    return !tverified ? NextResponse.redirect(new URL('/unverified-account', req.url), {status: 307}) : null;
  }
}
