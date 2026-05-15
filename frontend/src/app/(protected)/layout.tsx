import { redirect } from "next/navigation";
import { AppShell } from "@/shared/components/AppShell";
import { ToastProvider } from "@/shared/components/Toast";
import { getSession } from "@/shared/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <ToastProvider>
      <AppShell
        title="EZ-EMR"
        role={session.role}
        userEmail={session.email}
      >
        {children}
      </AppShell>
    </ToastProvider>
  );
}
