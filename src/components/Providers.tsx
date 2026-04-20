"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { TopLoadingBar } from "@/components/ui/PageTransition";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TopLoadingBar />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
