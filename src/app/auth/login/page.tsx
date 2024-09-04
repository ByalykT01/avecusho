import { LoginForm } from "~/components/auth/login-form";
import { Suspense } from "react";

export default function LogInPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
