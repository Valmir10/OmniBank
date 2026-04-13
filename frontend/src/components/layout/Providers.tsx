"use client";

import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { Navbar } from "./Navbar";
import { NotificationPanel } from "../ui/NotificationPanel";
import { ReactNode } from "react";

function AppShell({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const { alerts, dismissAlert } = useSocket(token);

  return (
    <>
      <Navbar />
      <NotificationPanel alerts={alerts} onDismiss={dismissAlert} />
      {children}
    </>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
