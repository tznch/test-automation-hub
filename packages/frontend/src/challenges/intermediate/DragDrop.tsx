import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

export default function DragDrop() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design landing page', status: 'todo' },
    { id: 2, title: 'Write API documentation', status: 'todo' },
    { id: 3, title: 'Implement authentication', status: 'in-progress' },
    { id: 4, title: 'Create database schema', status: 'in-progress' },
    { id: 5, title: 'Setup CI/CD pipeline', status: 'done' },
    { id: 6, title: 'Deploy to production', status: 'done' },
  ]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: { id: Task['status']; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      setTasks(tasks.map((task) => (task.id === draggedTask.id ? { ...task, status } : task)));
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kanban Board</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
              data-testid={`column-${column.id}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{column.label}</h3>
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
                className="min-h-[400px] space-y-3"
                data-testid={`drop-zone-${column.id}`}
              >
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition border-2 border-transparent hover:border-indigo-300"
                    data-testid={`task-${task.id}`}
                  >
                    <p className="text-gray-900 dark:text-white font-medium">{task.title}</p>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">To Do</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{getTasksByStatus('todo').length}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
            {getTasksByStatus('in-progress').length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-400 mb-1">Done</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-300">{getTasksByStatus('done').length}</p>
        </div>
      </div>
    </div>
  );
}
