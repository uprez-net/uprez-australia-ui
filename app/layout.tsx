import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./redux/provider";
import { Toaster } from "sonner";
import { UpgradeDialogProvider } from "@/context/UpgradeDialogContext";

export const metadata: Metadata = {
  title: "SME App",
  description: "SME IPO Management System",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body suppressHydrationWarning={true}>
          <Providers>
            <UpgradeDialogProvider>
            {children}
            <Toaster richColors position="top-right" />
            </UpgradeDialogProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
