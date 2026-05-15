import { ChangePasswordForm } from "@/modules/auth/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-600">EZ-EMR</h1>
          <p className="mt-1 text-sm text-gray-500">Set a new password to continue</p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
