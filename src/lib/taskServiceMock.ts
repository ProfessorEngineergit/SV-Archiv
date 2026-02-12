import { Task, TaskFormData } from '@/types/task';
import { calculateNextDueDate } from './taskUtils';

const STORAGE_KEY = 'sv-archiv-tasks';

/**
 * Mock task service using localStorage for demonstration
 * This allows testing the UI without Firebase credentials
 */

function getTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export async function createTask(taskData: TaskFormData): Promise<Task> {
  const tasks = getTasksFromStorage();
  
  const newTask: Task = {
    id: `task-${Date.now()}-${crypto.randomUUID()}`,
    title: taskData.title,
    dueDate: taskData.dueDate,
    repetitionInterval: taskData.repetitionInterval,
    progress: 0,
    completed: false,
    createdAt: new Date().toISOString(),
    nextDueDate: taskData.repetitionInterval !== 'none' 
      ? calculateNextDueDate(new Date(taskData.dueDate), taskData.repetitionInterval)?.toISOString()
      : undefined,
  };

  tasks.push(newTask);
  saveTasksToStorage(tasks);
  
  return newTask;
}

export async function getTasks(): Promise<Task[]> {
  const tasks = getTasksFromStorage();
  return tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function updateTaskProgress(taskId: string, progress: number, task: Task): Promise<void> {
  const tasks = getTasksFromStorage();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const completed = progress === 3;
  tasks[taskIndex].progress = progress;
  tasks[taskIndex].completed = completed;
  
  if (completed && task.repetitionInterval !== 'none') {
    const nextDate = calculateNextDueDate(new Date(task.dueDate), task.repetitionInterval);
    if (nextDate) {
      tasks[taskIndex].nextDueDate = nextDate.toISOString();
    }
  }
  
  saveTasksToStorage(tasks);
}

export async function deleteTask(taskId: string): Promise<void> {
  const tasks = getTasksFromStorage();
  const filteredTasks = tasks.filter(t => t.id !== taskId);
  saveTasksToStorage(filteredTasks);
}

export async function resetTaskForNextCycle(taskId: string, task: Task): Promise<void> {
  if (task.repetitionInterval === 'none' || !task.nextDueDate) {
    throw new Error('Task has no repetition interval');
  }

  const tasks = getTasksFromStorage();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const newDueDate = task.nextDueDate;
  const nextDate = calculateNextDueDate(new Date(newDueDate), task.repetitionInterval);

  tasks[taskIndex].progress = 0;
  tasks[taskIndex].completed = false;
  tasks[taskIndex].dueDate = newDueDate;
  tasks[taskIndex].nextDueDate = nextDate?.toISOString();
  
  saveTasksToStorage(tasks);
}
