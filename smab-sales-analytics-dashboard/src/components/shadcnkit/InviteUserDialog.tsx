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

export function InviteUserDialog () {

    
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
                <Input type="email" id="name-1" name="name" placeholder="johnDoe@example.com"/>
            </div>
   
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Invite</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
