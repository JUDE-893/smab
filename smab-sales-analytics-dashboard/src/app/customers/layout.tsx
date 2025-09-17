import type { Metadata } from "next";
import Providers from '@/components/Providers'



export const metadata: Metadata = {
  title: "Customers Activities",
  description: "smab customers purchase activities analysis",
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
