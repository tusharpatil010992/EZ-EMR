import { getSession, getAuthToken } from "@/shared/lib/session";
import { SubscriptionView } from "@/modules/subscription/components/SubscriptionView";
import { SubscriptionPlanInfo } from "@/modules/subscription/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export default async function SubscriptionPage() {
  const [session, token] = await Promise.all([getSession(), getAuthToken()]);

  let plan: SubscriptionPlanInfo | null = null;
  if (session?.tenantId && token) {
    try {
      const res = await fetch(`${BASE}/subscriptions/tenant/${session.tenantId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) plan = await res.json();
    } catch {
      // leave plan as null — view handles it gracefully
    }
  }

  return <SubscriptionView plan={plan} />;
}
