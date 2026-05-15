import { PageContainer } from "@/shared/components/PageContainer";
import { Card, CardTitle } from "@/shared/components/Card";
import { getSession } from "@/shared/lib/session";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <PageContainer>
      <Card>
        <CardTitle className="mb-2">Welcome back</CardTitle>
        <p className="text-sm text-gray-500">
          {session?.email} &mdash; {session?.role}
        </p>
      </Card>
    </PageContainer>
  );
}
