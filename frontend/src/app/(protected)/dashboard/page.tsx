import { AppShell } from "@/shared/components/AppShell";
import { DashboardView } from "@/modules/auth/components/DashboardView";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <DashboardView />
    </AppShell>
  );
}
