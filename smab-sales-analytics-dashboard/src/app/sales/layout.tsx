import type { Metadata } from "next";
import Providers from '@/components/Providers'



export const metadata: Metadata = {
  title: "Sales Metrics",
  description: "Smab sales metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    {children}
    </>
  );
}
