import type { Task, TaskStatus, TaskType } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const TYPE_LABELS: Record<TaskType, string> = {
  towels: "Towels",
  ice: "Ice",
  trash: "Trash",
  amenities: "Amenities",
  hallway_check: "Hallway Check",
  custom: "Custom",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_TONES: Record<TaskStatus, "neutral" | "success" | "warning"> = {
  pending: "warning",
  in_progress: "neutral",
  done: "success",
};

type TaskCardProps = {
  task: Task;
  onStatusChange?: (status: TaskStatus) => void;
  showActions?: boolean;
};

export function TaskCard({ task, onStatusChange, showActions = false }: TaskCardProps) {
  const time = new Date(task.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Card className="flex flex-col gap-3 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-zinc-900">
              {TYPE_LABELS[task.type]}
              {task.room ? ` · Room ${task.room}` : ""}
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">{time}</span>
          </div>
          <p className="text-xs text-zinc-500">
            {task.note || "No notes"}
            {task.created_by_name ? ` · by ${task.created_by_name}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge tone={STATUS_TONES[task.status]}>{STATUS_LABELS[task.status]}</Badge>
          {task.priority === "urgent" ? (
            <Badge className="bg-red-100 text-red-700">Urgent</Badge>
          ) : null}
        </div>
      </div>

      {showActions && onStatusChange ? (
        <div className="flex gap-2">
          {task.status === "pending" ? (
            <Button variant="secondary" onClick={() => onStatusChange("in_progress")}>
              Start
            </Button>
          ) : null}
          {task.status === "in_progress" ? (
            <Button onClick={() => onStatusChange("done")}>Mark Done</Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
