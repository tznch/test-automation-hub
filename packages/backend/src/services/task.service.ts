export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

class TaskQueue {
  private tasks: Map<string, Task> = new Map();

  createTask(name: string, duration: number = 5000): Task {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      status: 'pending',
      progress: 0,
    };

    this.tasks.set(task.id, task);

    // Simulate task execution
    setTimeout(() => {
      this.runTask(task.id, duration);
    }, 100);

    return task;
  }

  private async runTask(taskId: string, duration: number): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = 'running';
    task.startedAt = new Date().toISOString();

    const steps = 10;
    const stepDuration = duration / steps;

    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));

      if (task.status === 'running') {
        task.progress = (i / steps) * 100;

        // Simulate random failure (10% chance)
        if (Math.random() < 0.1 && i === 5) {
          task.status = 'failed';
          task.error = 'Simulated random failure';
          task.completedAt = new Date().toISOString();
          return;
        }
      }
    }

    task.status = 'completed';
    task.progress = 100;
    task.completedAt = new Date().toISOString();
    task.result = { success: true, processedItems: Math.floor(Math.random() * 1000) };
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  deleteTask(taskId: string): boolean {
    return this.tasks.delete(taskId);
  }

  // Cleanup completed tasks older than 1 hour
  cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, task] of this.tasks) {
      if (
        task.status === 'completed' &&
        task.completedAt &&
        new Date(task.completedAt).getTime() < oneHourAgo
      ) {
        this.tasks.delete(id);
      }
    }
  }
}

export const taskQueue = new TaskQueue();

// Cleanup every 10 minutes
setInterval(() => taskQueue.cleanup(), 10 * 60 * 1000);
