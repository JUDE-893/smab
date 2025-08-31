// app/layout.tsx or app/providers.tsx
import { ThemeProvider } from "./theme-provider";
import ReactQueryProvider from "./ReactQueryProvider";
import {
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
    </ThemeProvider>
  )
}
