"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AgentDetails } from './AgentDetails'

interface AgentDetailsDrawerProps {
  agentName: string
  trigger?: React.ReactNode
}

export function AgentDetailsDrawer({ agentName, trigger }: AgentDetailsDrawerProps) {

  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          {trigger || <Button variant="outline">View Order Details</Button>}
        </DrawerTrigger>
        <DrawerContent className="max-h-[95vh]">
          <div className="overflow-y-auto">
            {isOpen && <AgentDetails agentName={agentName} />}
          </div>
      </DrawerContent>
      </Drawer>
  )
}
