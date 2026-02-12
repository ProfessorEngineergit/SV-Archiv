import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task, TaskFormData } from '@/types/task';
import { calculateNextDueDate } from './taskUtils';

const TASKS_COLLECTION = 'tasks';

/**
 * Create a new task in Firestore
 */
export async function createTask(taskData: TaskFormData): Promise<Task> {
  try {
    const newTask = {
      title: taskData.title,
      dueDate: taskData.dueDate,
      repetitionInterval: taskData.repetitionInterval,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      nextDueDate: taskData.repetitionInterval !== 'none' 
        ? calculateNextDueDate(new Date(taskData.dueDate), taskData.repetitionInterval)?.toISOString()
        : null,
    };

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);

    return {
      id: docRef.id,
      ...newTask,
      nextDueDate: newTask.nextDueDate || undefined,
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Fehler beim Hinzufügen der Aufgabe. Bitte überprüfen Sie die Firebase-Berechtigungen.');
  }
}

/**
 * Get all tasks from Firestore
 */
export async function getTasks(): Promise<Task[]> {
  try {
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      orderBy('dueDate', 'asc')
    );

    const querySnapshot = await getDocs(tasksQuery);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Task));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Fehler beim Laden der Aufgaben.');
  }
}

/**
 * Update task progress (0, 1, 2, or 3)
 */
export async function updateTaskProgress(taskId: string, progress: number, task: Task): Promise<void> {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const completed = progress === 3;
    
    const updates: Record<string, unknown> = {
      progress,
      completed,
    };

    // If task is completed and has repetition, schedule next occurrence
    if (completed && task.repetitionInterval !== 'none') {
      const nextDate = calculateNextDueDate(new Date(task.dueDate), task.repetitionInterval);
      if (nextDate) {
        updates.nextDueDate = nextDate.toISOString();
      }
    }

    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error('Error updating task progress:', error);
    throw new Error('Fehler beim Aktualisieren der Aufgabe.');
  }
}

/**
 * Delete a task from Firestore
 */
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Fehler beim Löschen der Aufgabe.');
  }
}

/**
 * Reset task for next repetition cycle
 */
export async function resetTaskForNextCycle(taskId: string, task: Task): Promise<void> {
  try {
    if (task.repetitionInterval === 'none' || !task.nextDueDate) {
      throw new Error('Task has no repetition interval');
    }

    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const newDueDate = task.nextDueDate;
    const nextDate = calculateNextDueDate(new Date(newDueDate), task.repetitionInterval);

    await updateDoc(taskRef, {
      progress: 0,
      completed: false,
      dueDate: newDueDate,
      nextDueDate: nextDate?.toISOString() || null,
    });
  } catch (error) {
    console.error('Error resetting task:', error);
    throw new Error('Fehler beim Zurücksetzen der Aufgabe.');
  }
}
