import NextAuth from 'next-auth'
import { NextResponse } from 'next/server';
import {credentialOption} from '@/lib/authProviders'


export const {handlers:{GET, POST}, auth} =  NextAuth({
  providers: [
      credentialOption
    ],
  // Custom session strategy
  session: {
    strategy: "jwt",
  },

  // Custom pages (optional)
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error'  // Custom sign-in page
  },

  callbacks: {

  async signIn({ user, error }) {

      if (!user?.response?.ok) {
        // Bypass NextAuth's error rewriting;
        console.log('signin dataddddd',user.data);
        const errorParams = new URLSearchParams({
          error: JSON.stringify(user.data),
          code: user.response.status || "unknown",
          status: +(user.response.status || 500),
          ok: false,
        });
        return `/auth/error?${errorParams.toString()}`;
      };

      // Set cookie only on successful login
      if (user?.data?.token) {
        const response = new Response(JSON.stringify({ success: true }), {
          headers: {
            "Set-Cookie": `JWT_TOKEN_API=${user.data.token}; Path=/; HttpOnly; ${
              process.env.NODE_ENV === "production" ? "Secure; SameSite=Strict" : ""
            }`
          }
        });
        return response;
      }

      return true;
  },


  async jwt({ token, user }) {
    if (token) {
      token = { ...token, ...user };
      return token
    }
    return token.error;
  },


  async session({ session, token }) {
    session.user = token;
    return session;
  },

  async authorized(auth, request) {

    let l = auth?.["auth"]?.["user"]?.["data"]?.["token"];
    // console.log('l', l);
    return l;
  },


},
  // Additional configuration
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})
