import { Task, RepetitionInterval } from '@/types/task';

/**
 * Calculate the next due date based on repetition interval
 */
export function calculateNextDueDate(currentDate: Date, interval: RepetitionInterval): Date | null {
  if (interval === 'none') return null;
  
  const nextDate = new Date(currentDate);
  
  switch (interval) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'every-2-days':
      nextDate.setDate(nextDate.getDate() + 2);
      break;
    case 'every-3-days':
      nextDate.setDate(nextDate.getDate() + 3);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }
  
  return nextDate;
}

/**
 * Calculate days until due date
 */
export function calculateDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get human-readable repetition label
 */
export function getRepetitionLabel(interval: RepetitionInterval): string {
  const labels: Record<RepetitionInterval, string> = {
    'none': 'Keine Wiederholung',
    'daily': 'Täglich',
    'every-2-days': 'Alle 2 Tage',
    'every-3-days': 'Alle 3 Tage',
    'weekly': 'Wöchentlich',
    'monthly': 'Monatlich',
  };
  
  return labels[interval];
}

/**
 * Get due date display text
 */
export function getDueDateText(dueDate: string): string {
  const days = calculateDaysUntilDue(dueDate);
  
  if (days < 0) {
    return `Überfällig seit ${Math.abs(days)} Tag${Math.abs(days) === 1 ? '' : 'en'}`;
  } else if (days === 0) {
    return 'Heute fällig';
  } else if (days === 1) {
    return 'Morgen fällig';
  } else {
    return `Fällig in ${days} Tagen`;
  }
}
