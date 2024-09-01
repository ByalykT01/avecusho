import { LoginForm } from "~/components/auth/login-form";
import { Button } from "~/components/ui/button";

export default function LogInPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}
