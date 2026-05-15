// Browser-safe JWT payload decoder (no Buffer dependency)
export function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const segment = token.split(".")[1];
    // base64url → base64
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return {};
  }
}

export function getTokenRole(token: string): string {
  return (decodeJwtPayload(token).role as string) ?? "";
}
