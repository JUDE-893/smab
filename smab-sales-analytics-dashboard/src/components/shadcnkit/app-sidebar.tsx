"use client"

import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image';
import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCurrencyDollar,
  IconShoppingCartBolt
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/shadcnkit/nav-documents"
import { NavMain } from "@/components/shadcnkit/nav-main"
import { NavSecondary } from "@/components/shadcnkit/nav-secondary"
import { NavUser } from "@/components/shadcnkit/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sectionsConfig, reconcileObjects } from '@/components/config/app-sidebar-config'
import { useQueryParams } from "@/hooks/useQueryParams"

type SectionsConfig = {
  [key: string]: any
}

function SidebarLoading() {
  return (
    <div className="w-64 h-screen bg-sidebar animate-pulse">
      {/* Simple loading state that matches your sidebar style */}
      <div className="p-4">
        <div className="h-14 bg-gray-300 rounded mb-11"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

// const data = sectionsSetting;

function AppSidebarContent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { generatePDFMode } = useQueryParams();

  const [data, setData] = useState<SectionsConfig | null>(null)

  useEffect(() => {
    let settings;
    // 1. Try localStorage first
    settings = JSON?.parse(localStorage.getItem("sectionsSetting"));

    if (!settings) {
      // 2. Fallback: lazy load the module
      import("@/components/config/app-sidebar-config")
        .then((mod) => {
          // Optionally cache it for next time
          localStorage.setItem("sectionsSetting", JSON.stringify(mod.sectionsSetting))
          setData(reconcileObjects(mod.sectionsSetting, sectionsConfig));
        })
        .catch((err) => {
          console.error("Failed to load sectionsSetting", err)
        })
    } else {
      setData(reconcileObjects(settings, sectionsConfig))
    };
  }, [])

  if (generatePDFMode) return <></>



  if (!data) return <SidebarLoading />

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-orange-700 mb-11"
            >
              <a href="/sales" className=' flex items-center justify-center bg-orange-700 h-14'>
                <Image
                  src="/LOGO-SMAB-CROP-1white.png"
                  width="120"
                  height="5000"
                  alt="Logo"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Suspense fallback={<SidebarLoading />}>
      <AppSidebarContent {...props} />
    </Suspense>
  )
}
