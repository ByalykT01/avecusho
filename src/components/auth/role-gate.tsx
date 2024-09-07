"use client";

import { useCurrentRole } from "hooks/use-current-role";
import { FormError } from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: "ADMIN";
}

export function RoleGate({ children, allowedRole }: RoleGateProps) {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <div>
        <FormError message="You don't have permission to view this content!" />
      </div>
    );
  }

  return <>{children}</>;
}
