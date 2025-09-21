'use client'

import { signOut } from 'next-auth/react';
import {useEffect,useState, useRef} from 'react'
import {useParams, useRouter} from 'next/navigation'
import { useForm, Controller } from "react-hook-form"
import { useResetPassword } from '@/hooks/auth/useResetPassword'
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function ResetPasswordForm({
  className,
  ...props
  }) {


  const router = useRouter();
  const params = useParams();
  const { register, handleSubmit, watch, formState: { errors }} = useForm({defaultValues: {
    passwordConfirm: 'Password123',
    password:'Password123'
    }});

  const {restieng, resetPassword, resetError} = useResetPassword();


  useEffect(()=> {
    // auth error toast
    console.log(resetError);
    Boolean(resetError) && toast(resetError.message?.status === 'fails' ? "Validation Failed": "Oops! something went wrong.. Try again.", {
       variant: "destructive",
       description: <p className='text-destructive text-xs'>{resetError.message}</p>
    });

  },[resetError])

  async function onSubmit(data) {

      resetPassword({token: params.resetToken, data}, {
      onSuccess: () => {
        signOut({ redirect: false });
        router.push('/login')
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6 items-center", className)} {...props}>

      <Card className="overflow-hidden bg-background p-0 w-110">
        <CardContent className="grid p-0 ">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create New Password</h1>
                <p className="text-muted-foreground text-balance">
                   take your time to choose the right password
                </p>
              </div>

              <div className="grid gap-3 mt-3">
                <Label className='ml-1' htmlFor="password">Password</Label>
                <Input id="password" name='password' type="password" required {...register("password", {
                  required: "password is required",
                  validate: value => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value) || "Invalid password form"
                })} />
                {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
              </div>

              <div className="grid gap-3">
                <Label className='ml-1' htmlFor="password">Confirm password</Label>

                <Input id="password" type="password" required {...register("passwordConfirm",
                { required: "password Confirmation is required",
                  validate: value => value === watch("password") || "Passwords do not match"
                })} />
                {errors.passwordConfirm && <p className="text-destructive text-xs">{errors.passwordConfirm.message}</p>}
              </div>

              <Button type="submit" className="w-full">
                Reset Password
              </Button>



            </div>
          </form>
        </CardContent>
      </Card>

      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 w-150">
        Beside choosing a clear password, consider creating a strong & unique password to ensure your account is in safe hands.—Afterward you'll be able to log to your account securely.
      </div>
    </div>
  );
}
