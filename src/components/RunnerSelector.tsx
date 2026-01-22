import type { Profile } from "@/lib/types";
import { Select } from "@/components/ui/Select";

type RunnerSelectorProps = {
  runners: Profile[];
  selectedRunnerId: string;
  onChange: (runnerId: string) => void;
};

export function RunnerSelector({
  runners,
  selectedRunnerId,
  onChange,
}: RunnerSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        On-Shift Runner
      </label>
      <Select
        value={selectedRunnerId}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="" disabled>
          Select runner
        </option>
        {runners.map((runner) => (
          <option key={runner.id} value={runner.id}>
            {runner.full_name}
          </option>
        ))}
      </Select>
    </div>
  );
}
