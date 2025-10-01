import { LoginForm } from "@/components/custom/auth/login-form"
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
  );
}
