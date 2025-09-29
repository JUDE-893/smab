import { ResetPasswordForm } from "@/components/custom/auth/reset-password-form"

export const dynamic = "force-dynamic";

export default function Page() {
  return (
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetPasswordForm />
      </div>
  );
}
