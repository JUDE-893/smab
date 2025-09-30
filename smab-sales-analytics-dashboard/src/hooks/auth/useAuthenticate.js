import {useMutation} from '@tanstack/react-query';
import { signIn } from "next-auth/react";
import { sendVerificationMail } from '@/services/userServices';
import { useRouter } from 'next/navigation';
// import {signIn} from "@/auth";


export function useAuthenticate(data) {
  const router=useRouter();

  const {isPending, mutate, error} = useMutation({
    mutationFn: async(pld) => {
      const response = await signIn("credentials",pld);

      console.log("dd",response);
      if (response.error) {
          // Handle API-level errors
          throw new Error(JSON.stringify(response));
          return null
        }
      router.push(`/sales`);
      return response
          },
    // onSuccess : (data) => console.log('Success',data),
    // onError : (e) => console.log('Error',JSON.parse(e.message))
  })

  return {Authenticating: isPending,authonticate: mutate, authError: error}
}

export function useSendVerificationMail() {
  const {isPending, mutate, error} = useMutation({
    mutationFn: sendVerificationMail
  })
  return {sending: isPending,reSend: mutate, sendError: error}

}
