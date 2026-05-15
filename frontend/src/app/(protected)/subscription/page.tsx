import { AppShell } from "@/shared/components/AppShell";
import { SubscriptionView } from "@/modules/subscription/components/SubscriptionView";

export default function SubscriptionPage() {
  return (
    <AppShell title="Subscription">
      <SubscriptionView />
    </AppShell>
  );
}
