import type { Metadata } from "next";
import Providers from '@/components/Providers'



export const metadata: Metadata = {
  title: "Products Metrics",
  description: "Smab products analysis metrics",
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
