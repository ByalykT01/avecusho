"use client";

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "routes";

export function Social() {
  async function onClick(){
    await signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
    return null
  }
  return (
    <div className="w-fu flex w-full items-center gap-x-2">
      <Button size="lg" variant="outline" className="w-full" onClick={() => onClick()}>
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
}
