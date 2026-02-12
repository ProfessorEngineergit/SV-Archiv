'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { getTasks } from '@/lib/taskService';
import TaskCard from '@/components/tasks/TaskCard';
import AddTaskForm from '@/components/tasks/AddTaskForm';

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setError(null);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Fehler beim Laden der Aufgaben. Bitte überprüfen Sie Ihre Firebase-Konfiguration.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdate = () => {
    loadTasks();
  };

  return (
    <div className="task-page-bg min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neon-green mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Aufgaben
          </h1>
          <p className="text-text-secondary">
            Verwalten Sie Ihre Aufgaben mit dem 3-Phasen-System
          </p>
        </div>

        {/* Add Task Form */}
        <div className="mb-8">
          <AddTaskForm onTaskAdded={handleUpdate} />
        </div>

        {/* Error State */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="spinner mb-4"></div>
            <p className="text-text-secondary">Lade Aufgaben...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="empty-state">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Keine Aufgaben vorhanden</h3>
            <p>Erstellen Sie Ihre erste Aufgabe, um loszulegen!</p>
          </div>
        )}

        {/* Tasks Grid */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleUpdate} />
            ))}
          </div>
        )}

        {/* Info Card */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="mt-8 p-6 bg-dark-gray border border-medium-gray rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-neon-green">
              💡 So funktioniert's
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start">
                <span className="text-neon-green mr-2">•</span>
                Klicken Sie auf die Boxen, um Ihren Fortschritt zu markieren (33%, 66%, 100%)
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-2">•</span>
                Bei 100% erscheint ein Lösch-Button für die Aufgabe
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-2">•</span>
                Wiederholende Aufgaben werden automatisch neu geplant
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
