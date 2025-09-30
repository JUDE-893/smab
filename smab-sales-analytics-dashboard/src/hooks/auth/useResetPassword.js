import {useMutation} from '@tanstack/react-query';
import { signIn } from "next-auth/react";
import { sendPasswordResetRequest, resetPassword } from '@/services/userServices';

export function useRequestPasswordReset() {
  const {isPending, mutate, error} = useMutation({
    mutationFn: async (p) => {
      let r = await sendPasswordResetRequest(p);

      if (r.data.status !== 200) {
        throw new Error(r.data.message || "Oops! Something went wrong. Try again");
        return null
      }
      return r?.data
    },

  })
  return {requesting: isPending,requestReset: mutate, requestError: error}

}

export function useResetPassword() {
  const {isPending, mutate, error} = useMutation({
    mutationFn: async (p) => {
      let r = await resetPassword(p);

      if (r.data.status !== 200) {
        throw new Error(r.data.message || "Oops! Something went wrong. Try again");
        return null
      }
      return r?.data
    },
  })
  return {restieng: isPending,resetPassword: mutate, resetError: error}

}
