export type RepetitionInterval = 'none' | 'daily' | 'every-2-days' | 'every-3-days' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO date string
  repetitionInterval: RepetitionInterval;
  progress: number; // 0, 1, 2, or 3 (representing which boxes are completed)
  completed: boolean; // true when progress === 3
  createdAt: string; // ISO date string
  nextDueDate?: string; // For repeating tasks
}

export interface TaskFormData {
  title: string;
  dueDate: string;
  repetitionInterval: RepetitionInterval;
}
