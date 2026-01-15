export type LoadStatus = "waiting" | "washing" | "drying" | "done";
export type LoadType = "towels" | "sheets" | "mixed";

export type Load = {
  id: string;
  type: LoadType;
  weight_lbs: number;
  washer_started_at: string | null;
  washer_duration: number;
  dryer_started_at: string | null;
  dryer_duration: number;
  status: LoadStatus;
  notes: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  label: string;
  completed: boolean;
  created_at: string;
};
