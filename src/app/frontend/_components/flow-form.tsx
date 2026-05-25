"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type FlowFormProps = {
  nextHref: string;
  className?: string;
  children: ReactNode;
};

export function FlowForm({ nextHref, className, children }: FlowFormProps) {
  const router = useRouter();

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        router.push(nextHref);
      }}
    >
      {children}
    </form>
  );
}
