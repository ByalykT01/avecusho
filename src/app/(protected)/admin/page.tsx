"use client";

import { useCurrentRole } from "hooks/use-current-role";
import { toast } from "sonner";
import { RoleGate } from "~/components/auth/role-gate";
import { FormSuccess } from "~/components/form-success";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function AdminPage() {
  const onClick = async () => {
    await fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("GOOD")
      } else {
        toast.error("BAD");
      }
    });
  };
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className="w-[80%] shadow-md md:w-[50%] lg:w-[25%]">
        <CardHeader>
          <p className="text-center text-2xl font-semibold">Сторінка Адміна</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGate allowedRole="ADMIN">
            <FormSuccess message="Ти адмін" />{" "}
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Це тільки для адміна</p>
            <Button onClick={onClick}>Click to test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
