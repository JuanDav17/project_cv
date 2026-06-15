"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FlowFormProps = {
  nextHref: string;
  className?: string;
  children: ReactNode;
  /** Callback async ejecutado antes de navegar. Si lanza, la navegación no ocurre. */
  onBeforeSubmit?: () => Promise<void>;
};

export function FlowForm({ nextHref, className, children, onBeforeSubmit }: FlowFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  return (
    <form
      className={className}
      onSubmit={async (event) => {
        event.preventDefault();
        if (isPending) return;

        setIsPending(true);
        try {
          if (onBeforeSubmit) {
            await onBeforeSubmit();
          }
          router.push(nextHref);
        } catch {
          // El componente padre muestra el error; simplemente no navegamos.
        } finally {
          setIsPending(false);
        }
      }}
    >
      {children}
    </form>
  );
}
