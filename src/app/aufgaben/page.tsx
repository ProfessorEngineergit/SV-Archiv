import TasksClient from './TasksClient';

export const metadata = {
  title: 'Aufgaben | SV-Archiv',
  description: 'Verwalten Sie Ihre Aufgaben mit dem 3-Phasen-System',
};

export default function AufgabenPage() {
  return <TasksClient />;
}
