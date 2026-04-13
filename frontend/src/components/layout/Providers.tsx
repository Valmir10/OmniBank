"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
