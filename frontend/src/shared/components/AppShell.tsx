import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type Role = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "STAFF";

interface AppShellProps {
  title: string;
  role: Role;
  userEmail?: string;
  children: React.ReactNode;
}

export function AppShell({ title, role, userEmail, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={role} userEmail={userEmail} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
