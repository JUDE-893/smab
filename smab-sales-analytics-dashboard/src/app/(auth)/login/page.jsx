import { LoginForm } from "@/components/custom/auth/login-form"

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
  );
}
