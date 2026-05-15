export interface TenantDto {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  subscriptionPlanId: string | null;
}

export interface TenantOnboardingResponse {
  tenantId: string;
  tenantName: string;
  adminEmail: string;
  generatedPassword: string;
}

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  billingCycle: "MONTHLY" | "YEARLY";
  price: number;
  maxDoctors: number;
  active: boolean;
}
