"use client";

import { Button } from "../ui/button";

interface BuyButtonProps {
  label: string;
}
export function BuyButton({ label }: BuyButtonProps) {
  return (
    <Button className="w-full" size="sm" asChild>
      <p>{label} </p>
    </Button>
  );
}
