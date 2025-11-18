import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  column: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Design new logo',
      description: 'Create modern logo design',
      assignee: 'Alice',
      priority: 'high',
      column: 'in-progress',
    },
    {
      id: 2,
      title: 'Fix login bug',
      description: 'Users cant reset password',
      assignee: 'Bob',
      priority: 'high',
      column: 'todo',
    },
    {
      id: 3,
      title: 'Update documentation',
      description: 'Add API examples',
      assignee: 'Carol',
      priority: 'medium',
      column: 'todo',
    },
    {
      id: 4,
      title: 'Implement dark mode',
      description: 'Add theme switcher',
      assignee: 'David',
      priority: 'low',
      column: 'backlog',
    },
    {
      id: 5,
      title: 'Code review',
      description: 'Review PR #42',
      assignee: 'Eve',
      priority: 'medium',
      column: 'review',
    },
    {
      id: 6,
      title: 'Deploy v2.0',
      description: 'Production deployment',
      assignee: 'Frank',
      priority: 'high',
      column: 'done',
    },
  ]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as Task['priority'],
  });

  const columns: { id: Task['column']; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: 'bg-gray-100' },
    { id: 'todo', label: 'To Do', color: 'bg-blue-100' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-yellow-100' },
    { id: 'review', label: 'Review', color: 'bg-purple-100' },
    { id: 'done', label: 'Done', color: 'bg-green-100' },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (column: Task['column']) => {
    if (draggedTask) {
      setTasks(tasks.map((t) => (t.id === draggedTask.id ? { ...t, column } : t)));
      setDraggedTask(null);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now(),
      ...newTask,
      column: 'backlog',
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
    setShowAddModal(false);
  };

  const getTasksByColumn = (column: Task['column']) => {
    return tasks.filter((t) => t.column === column);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          data-testid="add-task-button"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByColumn(column.id);
          return (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4`}
              data-testid={`column-${column.id}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{column.label}</h3>
                <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
                className="min-h-[500px] space-y-3"
                data-testid={`drop-zone-${column.id}`}
              >
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm cursor-move hover:shadow-md transition border-l-4 border-indigo-600"
                    data-testid={`task-${task.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{task.title}</h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-xs font-medium text-indigo-700 dark:text-indigo-400">
                        {task.assignee[0]}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{task.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                  data-testid="task-title-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                  rows={3}
                  data-testid="task-description-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                  data-testid="task-assignee-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                  data-testid="task-priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddTask}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
                data-testid="save-task-button"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
