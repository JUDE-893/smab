
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { middlewarePipline } from '@/lib/middleware';
import { geoRestrict } from '@/middlewares/geoRestrict';
import { verifiedRestrict } from '@/middlewares/verifiedRestrict';
import { withAuth } from '@/middlewares/auth';


const publicRoutes = [
  '/login',
  '/register',
  '/reset-password/',
  '/forget-password',
  '/unverified-account',
]

export const middleware = async (request) => {
  const { pathname } = request.nextUrl;
  // force skip static routes
  if (pathname.startsWith('_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // public routes middleware
  if (publicRoutes.some((ppath) => pathname.startsWith(ppath))) {
    return middlewarePipline([geoRestrict/*, guest*/]) (request)
  }

  if (pathname.startsWith('/api')) {
    return middlewarePipline([geoRestrict/*, guest*/]) (request)
  }

  // protected routes
  return middlewarePipline([withAuth, geoRestrict, verifiedRestrict]) (request)

}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

// export const config = {
//   matcher: ["/:id"],
// }

// export const middleware = auth

// export const middleware = async (request) => await auth(request);


// export async function middleware(request) {
  //   const response = NextResponse.next();
  //   const session = await auth();
  //   console.log("[middleware]",response);
  //   console.log("[middleware SESSION]",session);
  //
  //   // Set multiple cookies
  //   if (session?.['user']?.['data']?.['token']) {
    //     response.cookies
    //     .set('api_token', session?.['user']?.['data']?.['token'], {
      //       httpOnly: true,
      //       sameSite: 'lax',
      //     })
      //   }
      //
      //   return response;
      // }
