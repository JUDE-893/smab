import NextAuth from 'next-auth'
import { NextResponse } from 'next/server';
import {credentialOption} from '@/lib/authProviders'
import { encryptJWT } from '@/lib/cryptoHelpers'

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

    // if (!user?.response?.ok) {
    //   // Bypass NextAuth's error rewriting;
    //   console.log('signin dataddddd',user.data);
    //   const errorParams = new URLSearchParams({
    //     error: JSON.stringify(user.data),
    //     code: user.response.status || "unknown",
    //     status: +(user.response.status || 500),
    //     ok: false,
    //   });
    //   return `/auth/error?${errorParams.toString()}`;
    // };

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
<<<<<<< HEAD
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.name = user.name;
      token.verifiedAt = user.verifiedAt;
      token.accessToken = user.token;
=======
    if (token) {
      token.data.token = await encryptJWT(token.data?.token, process.env.JWT_ENCRYPTION_SECRET);
      token = { ...token, ...user};
      return token
>>>>>>> e48352c5110a953e9e2691c34ac4d8dbdba0cf7c
    }
    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id;
    session.user.email = token.email;
    session.user.name = token.name;
    session.accessToken = token.accessToken;
    return session;
  },

  async authorized(auth, request) {

    let l = auth?.["auth"]?.["user"]?.["data"]?.["token"];
    // console.log('l', l);
    return l;
  }
},
  // Additional configuration
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})
