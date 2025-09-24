import CredentialsProvider from "next-auth/providers/credentials";
import { AuthError } from "next-auth";
import { headersToObject } from '@/lib/requestHelpers';
import { encryptJWT } from '@/lib/cryptoHelpers';
import { CredentialsSignin } from "next-auth";


class InvalidLoginError extends CredentialsSignin {
  code = "custom";
  constructor(message) {
    super(message);
    this.code = message;
  }
}

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
              // ⚠️ AUTH FAILURE: Throw structured error that NextAuth can handle
              const errorMessage = data.message || 'Authentication failed';
              const errorStatus = response.status;
              console.log("fff", data);
              
              // Create an error that NextAuth understands
              throw new InvalidLoginError("fddddddddddddddddddddddddddddddddddddddddd");
            }
          
        } catch (error) {
          console.log("_____________3RR0R________________", error);
          
          throw new InvalidLoginError((e).message);
        }
      }
    })


