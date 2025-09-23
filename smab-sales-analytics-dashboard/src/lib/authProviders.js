import CredentialsProvider from "next-auth/providers/credentials";
import { AuthError } from "next-auth";
import { headersToObject } from '@/lib/requestHelpers';
import { encryptJWT } from '@/lib/cryptoHelpers';

export const credentialOption = CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'email', type: 'text'}
      },
      async authorize(credis, req) {
        // SET UP CLIENT HEADERS
        const headersObj = headersToObject(req);
        headersObj.cookie = undefined;
        console.log('{headersObj}', headersObj);
        try {

          // prepare the payload
          let payload = {email: credis.email, password: credis.password},
          url = '/login';

          if (credis.mode === 'register') {
            payload = {...payload, name: credis.name, passwordConfirm: credis.passwordConfirm};
            url = '/register';
          }

          // make auth request
          let response = await fetch(process.env.BACKEND_API_BASE_URL+"/auth"+url, {
            method: 'POST',
            headers: {
              ...headersObj,
              "content-type": 'application/json'
            },
            body: JSON.stringify(payload)
          })

          // response
          const data = await response.json();
          // ✅ CORRECT: Return only serializable data
          if (response.ok && data.status === 'success') {
            const token = await encryptJWT(data?.token, process.env.JWT_ENCRYPTION_SECRET);
            
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              verifiedAt: data.user.verifiedAt,
              token: token ?? null,
            }
          } else {
            return null;
          }
        } catch (error) {
          // Preserve API errors, only fallback for unexpected errors
          // if (error?.name === 'ApiError') throw error;
          throw new AuthError(JSON.stringify({
            statusCode: 500,
            message: 'Authentication failed',
            error: error.message
          }));
        }
      }
    })
