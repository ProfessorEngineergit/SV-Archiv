'use client';

import { useState } from 'react';
import { RepetitionInterval, TaskFormData } from '@/types/task';
import { createTask } from '@/lib/taskService';
import { getRepetitionLabel } from '@/lib/taskUtils';

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    dueDate: '',
    repetitionInterval: 'none',
  });

  const repetitionOptions: RepetitionInterval[] = [
    'none',
    'daily',
    'every-2-days',
    'every-3-days',
    'weekly',
    'monthly',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Bitte geben Sie einen Titel ein');
      return;
    }

    if (!formData.dueDate) {
      setError('Bitte wählen Sie ein Fälligkeitsdatum');
      return;
    }

    setIsSubmitting(true);

    try {
      await createTask(formData);
      
      // Reset form
      setFormData({
        title: '',
        dueDate: '',
        repetitionInterval: 'none',
      });
      
      setIsOpen(false);
      onTaskAdded();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Fehler beim Hinzufügen der Aufgabe. Bitte überprüfen Sie Ihre Firebase-Konfiguration und Berechtigungen.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-neon-green w-full sm:w-auto"
      >
        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Neue Aufgabe
      </button>
    );
  }

  return (
    <div className="task-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="task-title">Neue Aufgabe erstellen</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setError(null);
          }}
          className="text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Schließen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="error-message mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="label-oled block mb-2">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-oled w-full"
            placeholder="z.B. Hausaufgaben erledigen"
            disabled={isSubmitting}
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="label-oled block mb-2">
            Fälligkeitsdatum
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="input-oled w-full"
            min={getTomorrowDate()}
            disabled={isSubmitting}
          />
        </div>

        {/* Repetition Interval */}
        <div>
          <label htmlFor="repetition" className="label-oled block mb-2">
            Wiederholung
          </label>
          <select
            id="repetition"
            value={formData.repetitionInterval}
            onChange={(e) =>
              setFormData({ ...formData, repetitionInterval: e.target.value as RepetitionInterval })
            }
            className="select-oled w-full"
            disabled={isSubmitting}
          >
            {repetitionOptions.map((option) => (
              <option key={option} value={option}>
                {getRepetitionLabel(option)}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-neon-green flex-1"
          >
            {isSubmitting ? (
              <>
                <span className="spinner inline-block w-4 h-4 mr-2 border-2 border-oled-black border-t-transparent"></span>
                Wird erstellt...
              </>
            ) : (
              'Aufgabe erstellen'
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
            disabled={isSubmitting}
            className="px-6 py-3 border-2 border-medium-gray text-text-secondary rounded-lg hover:border-text-secondary transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
