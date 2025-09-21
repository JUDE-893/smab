'use client'

import {useEffect,useState, useRef} from 'react'
import {useSearchParams, useRouter} from 'next/navigation'
import { useRequestPasswordReset } from '@/hooks/auth/useResetPassword'
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function ForgetPasswordForm({
  className,
  ...props
  }) {

  const [payload, setPayload] = useState({email:''});
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const {requesting, requestReset, requestError} = useRequestPasswordReset();


  // useEffect(()=> {
  //   console.log(requestError)
  //   // auth error toast
  //   Boolean(requestError) && toast(JSON.parse(requestError.message).status === 'fails' ? "Validation Failed": "Oops! something went wrong.. Try again.", {
  //      variant: "destructive",
  //      description: <p className='text-destructive text-xs'>{JSON.parse(requestError.message).message}</p>
  //   });
  //
  // },[requestError])



  return (
    <div className={cn("flex flex-col gap-6 items-center", className)} {...props}>

      <Card className="overflow-hidden bg-background p-0 w-110">
        <CardContent className="grid p-0 ">
          <form onSubmit={(e) => {e.preventDefault(); requestReset(payload)
          }} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Enter Email</h1>
                <p className="text-muted-foreground text-balance">
                   used to create your Huginn account
                </p>
              </div>
              <div className="grid gap-3 mt-4">
                <Input value={payload.email} onChange={(e) => setPayload({email: e.target.value})} id="email" type="email" placeholder="m@example.com" required />
              </div>

              <Button type="submit" className="w-full" disabled={!payload?.email || payload?.email?.length <= 0}>
                Submit Request
              </Button>



            </div>
          </form>
        </CardContent>
      </Card>

      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 w-150">
        —By providing the email address used to register, you'll recieve an email that allow to proceed and reset your account password.
      </div>
    </div>
  );
}
