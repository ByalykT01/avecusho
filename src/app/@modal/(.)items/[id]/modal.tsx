"use client";

import { type ElementRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      setIsOpen(true); // Set isOpen to true when modal is shown
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 h-screen w-screen bg-zinc-300/30 transition-all duration-500 ease-in-out ${isOpen ? "backdrop-blur-sm" : "backdrop-blur-none"}`}      
      onClose={onDismiss}
    >
      {children}
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
