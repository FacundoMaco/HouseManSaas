import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  const tones = {
    neutral: "bg-zinc-100 text-zinc-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
