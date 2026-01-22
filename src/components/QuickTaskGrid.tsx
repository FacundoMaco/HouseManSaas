import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { TaskType } from "@/lib/types";

const QUICK_TASKS: { type: TaskType; label: string }[] = [
  { type: "towels", label: "Towels" },
  { type: "ice", label: "Ice" },
  { type: "trash", label: "Trash" },
  { type: "amenities", label: "Amenities" },
  { type: "hallway_check", label: "Hallway Check" },
];

type QuickTaskGridProps = {
  room: string;
  onRoomChange: (value: string) => void;
  onSend: (type: TaskType) => void;
  sendingType?: TaskType | null;
};

export function QuickTaskGrid({
  room,
  onRoomChange,
  onSend,
  sendingType,
}: QuickTaskGridProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Quick Tasks</h2>
        <p className="text-xs text-zinc-500">Tap a task to send in seconds.</p>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Room
        </label>
        <Input
          value={room}
          onChange={(event) => onRoomChange(event.target.value)}
          placeholder="214"
          inputMode="numeric"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {QUICK_TASKS.map((task) => (
          <Button
            key={task.type}
            variant="secondary"
            className="h-11 justify-start"
            onClick={() => onSend(task.type)}
            disabled={sendingType === task.type}
          >
            {sendingType === task.type ? "Sending..." : task.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
