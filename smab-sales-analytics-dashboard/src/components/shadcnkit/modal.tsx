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

export function Modal({children, trigger, className}) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        { trigger }
      </DialogTrigger>
      <DialogContent className={" " + className}>
        { children }
      </DialogContent>
    </Dialog>
  )
}
