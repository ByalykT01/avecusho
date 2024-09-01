"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

export function Social() {
  return (
    <div className="w-fu flex w-full items-center gap-x-2">
      <Button size="lg" variant="outline" className="w-full" onClick={() => {}}>
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
}
