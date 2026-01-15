export type LoadStatus = "waiting" | "washing" | "drying" | "done";
export type LoadType = "towels" | "pillowcases_towels" | "towels_feet";

export type Load = {
  id: string;
  type: LoadType;
  washer_started_at: string | null;
  washer_duration: number;
  dryer_started_at: string | null;
  dryer_duration: number;
  dryer_number: 1 | 2 | null; // Qué secadora está usando (1 o 2)
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
