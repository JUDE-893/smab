// app/layout.tsx or app/providers.tsx
import { ThemeProvider } from "./theme-provider";
import ReactQueryProvider from "./ReactQueryProvider";
import { SessionProvider } from 'next-auth/react'

import {
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ReactQueryProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            {children}
          </SidebarProvider>
        </ReactQueryProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
