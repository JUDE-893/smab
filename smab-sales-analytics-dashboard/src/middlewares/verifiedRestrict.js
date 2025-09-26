import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from "next/headers";
import { decryptJWT } from '@/lib/cryptoHelpers';

export async function verifiedRestrict(req) {


  const verifiedCookie = cookies().get("vertkn");
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const decryptedToken = await await decryptJWT(token?.accessToken, process.env.JWT_ENCRYPTION_SECRET);
  let tverified = verifiedCookie?.value === decryptedToken?.slice(0,32);
  console.log('tverified', tverified);
  console.log('_______________________________________________')
  console.log('token', token);
  console.log('_______________________________________________')
  console.log('verifiedCookie', verifiedCookie)

  if (!token || !token?.verifiedAt) {
    return !tverified ? NextResponse.redirect(new URL('/unverified-account', req.url), {status: 307}) : null;
  }
}
