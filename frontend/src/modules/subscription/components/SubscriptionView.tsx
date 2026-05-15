import { PageContainer } from "@/shared/components/PageContainer";
import { Card, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";

export function SubscriptionView() {
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <Badge variant="success">Active</Badge>
        </CardHeader>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Plan: <span className="font-medium text-gray-900">—</span></p>
          <p>Renewal Date: <span className="font-medium text-gray-900">—</span></p>
          <p>Seats: <span className="font-medium text-gray-900">—</span></p>
        </div>
        <div className="mt-6">
          <Button variant="secondary" size="sm">Manage Plan</Button>
        </div>
      </Card>
    </PageContainer>
  );
}
