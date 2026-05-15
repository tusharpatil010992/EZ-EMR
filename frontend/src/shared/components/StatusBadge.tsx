import { Badge } from "./Badge";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

const APPOINTMENT_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  SCHEDULED: { label: "Scheduled", variant: "info" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "error" },
};

const TENANT_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "Active", variant: "success" },
  INACTIVE: { label: "Inactive", variant: "neutral" },
};

interface StatusBadgeProps {
  status: string;
  type?: "appointment" | "tenant";
}

export function StatusBadge({ status, type = "appointment" }: StatusBadgeProps) {
  const map = type === "tenant" ? TENANT_STATUS_MAP : APPOINTMENT_STATUS_MAP;
  const { label, variant } = map[status] ?? { label: status, variant: "neutral" as BadgeVariant };
  return <Badge variant={variant}>{label}</Badge>;
}
