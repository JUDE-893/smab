"use client"

import Link from 'next/link';
import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { buttonVariants } from "@/components/ui/button"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => (
              <SidebarMenuItem key={item.title} className={cn(
                buttonVariants({ variant: "transparent" }),
                pathname === item.url
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-muted",
                  "justify-start"
              )}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
