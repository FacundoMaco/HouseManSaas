import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
  };

  return (
    <button className={cn(base, styles[variant], className)} {...props} />
  );
}
