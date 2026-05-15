import { AppShell } from "@/shared/components/AppShell";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/appointments": "Appointments",
  "/subscription": "Subscription",
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
