import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Word Sanctuary Trainings",
  description: "Word Sanctuary Training Platform",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
