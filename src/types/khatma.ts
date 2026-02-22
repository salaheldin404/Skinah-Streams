/** Serialized khatma plan (dates as ISO strings for client use) */
export interface KhatmaPlan {
  id: string;
  userId: string;
  pagesPerDay: number;
  totalPages: number;
  startDate: string;
  targetEndDate: string;
  currentPage: number;
  completedPages: number;
  isActive: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  title: string | null;
  notes: string | null;
  totalPausedDays: number;
  bookMarkIndex: number | null;
  pausedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields accepted when updating a khatma plan */
export interface UpdateKhatmaPlanData {
  currentPage?: number;
  completedPages?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  pagesPerDay?: number;
  title?: string;
  notes?: string;
  pausedAt?: string | null;
  totalPausedDays?: number;
  bookMarkIndex?: number | null;
}

/** Standard shape for server action responses */
export interface KhatmaActionResult {
  message: string;
  status: number;
}
