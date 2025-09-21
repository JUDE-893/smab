import type { Metadata } from "next";
import Providers from '@/components/Providers'



export const metadata: Metadata = {
  title: "Unverified Account",
  description: "Your account is yet to be verified, Check you mail sandbox for verification message",
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
