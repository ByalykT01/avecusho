import { ErrorCard } from "~/components/auth/error-card";

export default function AuthErrorPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ErrorCard />
    </div>
  );
}
