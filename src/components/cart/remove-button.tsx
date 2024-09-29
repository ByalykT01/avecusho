"use client";

import { Button } from "../ui/button";

interface RemoveButtonProps {
  label: string;
}
export function RemoveButton({ label }: RemoveButtonProps) {
  return (
    <Button variant="destructive" className="w-full" size="sm" asChild>
      <p>{label} </p>
    </Button>
  );
}
