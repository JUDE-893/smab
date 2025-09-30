import { RegisterForm } from "@/components/custom/auth/register-form"

export const dynamic = "force-dynamic";

export default function Page() {
  return (
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
  );
}
