import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


export default function layout({ className, children,...props }) {
  return (
    <div
      className="bg-background flex h-screen w-screen flex-col items-center justify-center p-6 md:p-10 absolute z-10">
      {children}
    </div>
  )
}
