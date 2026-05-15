import { AppShell } from "@/shared/components/AppShell";
import { AppointmentList } from "@/modules/appointment/components/AppointmentList";

export default function AppointmentsPage() {
  return (
    <AppShell title="Appointments">
      <AppointmentList />
    </AppShell>
  );
}
