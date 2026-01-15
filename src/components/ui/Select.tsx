import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900",
        className
      )}
      {...props}
    />
  );
}
