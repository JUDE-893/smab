"use client"

import { Suspense } from 'react'
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
import { Modal } from '@/components/shadcnkit/modal'
import SearchBox from '@/components/shadcnkit/page-content-searchBox'
import { useQueryParams } from "@/hooks/useQueryParams"

const data = {
  user: {
    name: "John Deer",
    email: "JD@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/sales",
      icon: IconDashboard,
    },
    {
      title: "Growth Metrics",
      url: "/growth-metrics",
      icon: IconChartBar,
    },
    {
      title: "Sales Metrics",
      url: "/sales",
      icon: IconCurrencyDollar,
    },
    {
      title: "Fast Moving Products",
      url: "/products",
      icon: IconShoppingCartBolt,
    },
    {
      title: "Customers Activities",
      url: "/customers",
      icon: IconUsers,
    },
    // {
    //   title: "Lifecycle",
    //   url: "#",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: IconFolder,
    // }
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: (<Modal trigger={<h1>Search</h1>}
                     className='w-[2000]'
              >
                <SearchBox />
             </Modal>),
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    // {
    //   name: "Data Library",
    //   url: "#",
    //   icon: IconDatabase,
    // },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: IconFileWord,
    // },
  ],
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

function AppSidebarContent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { generatePDFMode } = useQueryParams();

  if (generatePDFMode) return <></>

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