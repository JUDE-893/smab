'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconUserPlus } from "@tabler/icons-react"
import { useCustomMutation } from '@/hooks/useCustomQuery'
import { inviteUser } from '@/services/userServices'
import { toast } from "sonner"

export function InviteUserDialog () {

  const [input, setInput] = useState("")
  const {isPending, mutate, error} = useCustomMutation(inviteUser);

  useEffect(()=> {
  // auth error toast
  Boolean(error) && toast("Oops! something went wrong.. Try again.", {
     variant: "destructive",
     description: <p className='text-destructive text-xs'>{error.message}</p>
  });

},[error])

  // handle submit invitation request
  function hundleSubmit() {
    mutate({data : {email:input}});
    setInput("");
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="gost" className="hover:bg-input mr-4"><IconUserPlus /> Invite </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Enter user email address to send an invitation request to his sandbox
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-3">
                <Label htmlFor="name-1">Email</Label>
                <Input type="email" id="name-1" name="name" placeholder="johnDoe@example.com" value={input} onChange={(e) => setInput(e.target.value)}/>
            </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disable={isPending} onClick={hundleSubmit}>Invite</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
