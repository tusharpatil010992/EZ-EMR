import { AppShell } from "@/shared/components/AppShell";
import { PatientList } from "@/modules/patient/components/PatientList";

export default function PatientsPage() {
  return (
    <AppShell title="Patients">
      <PatientList />
    </AppShell>
  );
}
