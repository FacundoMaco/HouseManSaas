export type UserRole = "frontdesk" | "runner" | "manager";
export type TaskType = "towels" | "ice" | "trash" | "amenities" | "hallway_check" | "custom";
export type TaskPriority = "normal" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "done";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  on_shift: boolean;
  created_at: string;
};

export type Task = {
  id: string;
  type: TaskType;
  room: string | null;
  note: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to: string;
  created_by: string;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
};

export type MachineType = "washer" | "dryer";
export type MachineStatus = "idle" | "running" | "done";

export type Machine = {
  id: string;
  name: string;
  type: MachineType;
  status: MachineStatus;
  ends_at: string | null;
  started_by: string | null;
  started_by_name: string | null;
  load_type: string | null;
  updated_at: string;
};
