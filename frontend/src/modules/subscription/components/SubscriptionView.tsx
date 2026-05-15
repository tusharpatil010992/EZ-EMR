import { Card, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { PageContainer } from "@/shared/components/PageContainer";
import { SubscriptionPlanInfo } from "../types";

interface SubscriptionViewProps {
  plan: SubscriptionPlanInfo | null;
}

export function SubscriptionView({ plan }: SubscriptionViewProps) {
  const statusVariant =
    plan?.status === "ACTIVE" ? "success" : plan?.status === "EXPIRED" ? "error" : "neutral";

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          {plan && <Badge variant={statusVariant}>{plan.status}</Badge>}
        </CardHeader>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>
            Plan:{" "}
            <span className="font-medium text-gray-900">{plan?.planName ?? "—"}</span>
          </p>
          <p>
            Renewal Date:{" "}
            <span className="font-medium text-gray-900">
              {plan?.renewalDate ? new Date(plan.renewalDate).toLocaleDateString() : "—"}
            </span>
          </p>
          <p>
            Doctor Seats:{" "}
            <span className="font-medium text-gray-900">{plan?.seats ?? "—"}</span>
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
