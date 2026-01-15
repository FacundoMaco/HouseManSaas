import { cn } from "@/lib/cn";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-zinc-100", className)}>
      <div
        className="h-full rounded-full bg-zinc-900 transition-all"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
