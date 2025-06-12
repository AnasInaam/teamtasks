// TODO: This KanbanBoard page currently lacks real data integration.
// - Replace all mockTasks, mockProjects, and columns with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding/updating tasks, columns, etc.
// - Remove this comment after full backend integration.

import React from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import TaskCard from '../components/ui/TaskCard';
import { TaskPriority, TaskStatus } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';

const statusList: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

const KanbanBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch project info
  const { projects, isLoading: projectLoading, error: projectError } = useProjects({ page: 1, pageSize: 1, searchTerm: undefined, teamId: undefined });
  const project = projects?.find(p => p.id === projectId);

  // Fetch tasks for this project
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks({ page: 1, pageSize: 100, projectId });

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, typeof tasks> = {
    todo: [],
    'in-progress': [],
    review: [],
    done: []
  };
  (tasks || []).forEach(task => {
    const status = (task.status as TaskStatus) || 'todo';
    if (statusList.includes(status)) {
      (tasksByStatus[status] = tasksByStatus[status] || []).push(task);
    }
  });

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  if (projectError || tasksError) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <X size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading Kanban board</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {projectError instanceof Error ? projectError.message : tasksError instanceof Error ? tasksError.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {project?.name || 'Project Kanban'}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusList.map((status) => (
          <div key={status} className="card bg-gray-50 dark:bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold capitalize text-gray-800 dark:text-white">{status.replace('-', ' ')}</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{(tasksByStatus[status] || []).length} tasks</span>
            </div>
            <div className="space-y-3 min-h-[60px]">
              {(tasksByStatus[status] || []).length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">No tasks</div>
              ) : (
                (tasksByStatus[status] || []).map((task) => (
                  <TaskCard key={task.id} task={{
                    id: task.id,
                    title: task.title,
                    description: task.description || undefined,
                    status: task.status as TaskStatus,
                    priority: task.priority as TaskPriority,
                    dueDate: task.due_date || undefined,
                    assignees: task.assignees.map(assignee => ({
                      id: assignee.user.id,
                      name: assignee.user.name,
                      avatar: assignee.user.avatar_url || undefined
                    })),
                    commentCount: 0, // TODO: Add real comment count
                    attachmentCount: 0 // TODO: Add real attachment count
                  }} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;