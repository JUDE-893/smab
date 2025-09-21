import {useMutation} from '@tanstack/react-query';
import { signIn } from "next-auth/react";
import { sendPasswordResetRequest, resetPassword } from '@/services/userServices';

export function useRequestPasswordReset() {
  const {isPending, mutate, error} = useMutation({
    mutationFn: sendPasswordResetRequest
  })
  return {requesting: isPending,requestReset: mutate, requestError: error}

}

export function useResetPassword() {
  const {isPending, mutate, error} = useMutation({
    mutationFn: resetPassword
  })
  return {restieng: isPending,resetPassword: mutate, resetError: error}

}
