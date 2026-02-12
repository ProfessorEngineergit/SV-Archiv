'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { getDueDateText, getRepetitionLabel } from '@/lib/taskUtils';
import { updateTaskProgress, deleteTask } from '@/lib/taskService';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [justCompletedBox, setJustCompletedBox] = useState<number | null>(null);

  const handleBoxClick = async (boxNumber: number) => {
    if (isUpdating) return;

    // Toggle: if already at this progress, go back; otherwise advance
    const newProgress = task.progress === boxNumber ? boxNumber - 1 : boxNumber;
    
    if (newProgress < 0) return;

    setIsUpdating(true);
    setJustCompletedBox(boxNumber);

    try {
      await updateTaskProgress(task.id, newProgress, task);
      setTimeout(() => {
        setJustCompletedBox(null);
        onUpdate();
      }, 500);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Fehler beim Aktualisieren der Aufgabe');
      setJustCompletedBox(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Möchten Sie diese Aufgabe wirklich löschen?')) return;

    setIsUpdating(true);
    try {
      await deleteTask(task.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Fehler beim Löschen der Aufgabe');
      setIsUpdating(false);
    }
  };

  const dueText = getDueDateText(task.dueDate);
  const isOverdue = dueText.includes('Überfällig');
  const progressPercentage = Math.round((task.progress / 3) * 100);

  return (
    <div className={`task-card p-6 ${task.completed ? 'completed' : ''}`}>
      {/* Header with title and due date */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="task-title mb-2">{task.title}</h3>
          <div className={`due-badge ${isOverdue ? 'overdue' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dueText}
          </div>
        </div>
      </div>

      {/* Repetition info */}
      {task.repetitionInterval !== 'none' && (
        <div className="text-sm text-secondary mb-4">
          <span className="opacity-70">Wiederholung:</span> {getRepetitionLabel(task.repetitionInterval)}
        </div>
      )}

      {/* Progress boxes (battery indicator) */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((boxNumber) => (
            <button
              key={boxNumber}
              onClick={() => handleBoxClick(boxNumber)}
              disabled={isUpdating}
              className={`
                progress-box w-16 h-16 
                ${task.progress >= boxNumber ? 'completed' : ''} 
                ${justCompletedBox === boxNumber ? 'just-completed' : ''}
              `}
              aria-label={`Box ${boxNumber} ${task.progress >= boxNumber ? 'completed' : 'incomplete'}`}
            />
          ))}
        </div>
        <div className="progress-text">
          {progressPercentage}% erledigt
        </div>
      </div>

      {/* Next due date for repeating tasks */}
      {task.completed && task.nextDueDate && (
        <div className="text-sm mb-4 p-3 bg-medium-gray rounded-lg">
          <span className="opacity-70">Nächste Fälligkeit:</span>{' '}
          <span className="text-neon-green font-semibold">
            {new Date(task.nextDueDate).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Delete button (shown when task is completed) */}
      {task.completed && (
        <button
          onClick={handleDelete}
          disabled={isUpdating}
          className="btn-delete w-full mt-2"
        >
          Aufgabe löschen
        </button>
      )}
    </div>
  );
}
