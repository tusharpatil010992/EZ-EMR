export interface SubscriptionPlanInfo {
  id: string;
  planName: string;
  renewalDate: string | null;
  seats: number;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
}
