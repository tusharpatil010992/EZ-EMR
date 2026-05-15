import { Card, CardHeader, CardTitle } from "@/shared/components/Card";
import { PageContainer } from "@/shared/components/PageContainer";

const stats = [
  { label: "Total Patients", value: "0" },
  { label: "Today's Appointments", value: "0" },
  { label: "Walk-ins Today", value: "0" },
  { label: "Active Subscriptions", value: "0" },
];

export function DashboardView() {
  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
