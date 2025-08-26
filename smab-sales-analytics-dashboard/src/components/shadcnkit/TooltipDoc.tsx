import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconQuestionMark } from "@tabler/icons-react"

export function TooltipDoc({text}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="w-5 h-6 rounded-full p-0"><IconQuestionMark/></Button>
      </TooltipTrigger>
      <TooltipContent className="w-45" >
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
