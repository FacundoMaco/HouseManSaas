import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
