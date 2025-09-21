"use client"

import { useSendVerificationMail } from '@/hooks/auth/useAuthenticate';
import ReportInterface from "@/components/shadcnKit/ReportInterface";
import { Loader } from "lucide-react"


export default function Unverified() {
  const {sending, reSend, sendError} = useSendVerificationMail()

  if (!sending) return <ReportInterface className="bg-background absolute z-10 h-screen" image='/unverified-account.svg' message={
    <span>
      <p className=' text-destructive'>Your account is yet inactive. Please check your mail inbox to verify your account.</p>
      <p className='text-white-100 text-xs mt-4'>If you can't see any email consider checking your Spam inbox <span className="text-[15px] mx-1">Or</span> <span className='underline cursor-pointer hover:text-destructive' onClick={reSend}> Resend the email</span></p>
    </span>
  }/>;

  return <div className='bg-background absolute z-10 h-screen'><div className=" flex justify-center items-center relative w-screen h-screen"><Loader size={50} className=" absolute animate-spin text-destructive" /></div></div>
}
