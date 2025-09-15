"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { CustomerDetails } from './CustomerDetails'

interface ProductDetailsDrawerProps {
  customerName: string
  trigger?: React.ReactNode
}

export function CustomerDetailsDrawer({ customerName, trigger }: ProductDetailsDrawerProps) {

  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          {trigger || <Button variant="outline">View Order Details</Button>}
        </DrawerTrigger>
        <DrawerContent className="max-h-[95vh]">
          <div className="overflow-y-auto">
            {isOpen && <CustomerDetails customerName={customerName} />}
          </div>
      </DrawerContent>
      </Drawer>
  )
}
