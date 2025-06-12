// TODO: This ProjectDetails page currently lacks real data integration.
// - Replace all mockProject and mockTasks with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding tasks, editing project, etc.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  ChevronLeft,
  Kanban,
  BarChart
} from 'lucide-react';
import TaskCard from '../components/ui/TaskCard';
import { TaskPriority, TaskStatus } from '../types/task';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';

const ProjectDetails: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files'>('overview');

  // Fetch project details
  const { projects, isLoading: projectLoading, error: projectError } = useProjects({ page: 1, pageSize: 1 });
  const project = projects?.find(p => p.id === projectId);

  // Fetch tasks for this project
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks({ page: 1, pageSize: 100, projectId });

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
          <Kanban size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading project details</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {projectError instanceof Error ? projectError.message : tasksError instanceof Error ? tasksError.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Project not found</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/projects" className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">{project.name}</h1>
        <Link to={`/kanban/${project.id}`} className="btn btn-secondary ml-2">
          <Kanban size={18} className="mr-1" /> Kanban
        </Link>
      </div>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {project.due_date && (
            <span className="flex items-center"><Calendar size={16} className="mr-1" /> Due {new Date(project.due_date).toLocaleDateString()}</span>
          )}
          <span className="flex items-center"><Users size={16} className="mr-1" />{project.team?.members?.length || 0} team members</span>
          <span className="flex items-center"><BarChart size={16} className="mr-1" />Progress: {project.progress || 0}%</span>
        </div>
      </div>
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 flex gap-6">
        <button className={`pb-2 border-b-2 ${activeTab === 'overview' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`pb-2 border-b-2 ${activeTab === 'tasks' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
        <button className={`pb-2 border-b-2 ${activeTab === 'timeline' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('timeline')}>Timeline</button>
        <button className={`pb-2 border-b-2 ${activeTab === 'files' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('files')}>Files</button>
      </div>
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Project Overview</h2>
          <p>{project.description || 'No description provided.'}</p>
        </div>
      )}
      {activeTab === 'tasks' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          {tasks && tasks.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map(task => (
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
              ))}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No tasks found for this project.</div>
          )}
        </div>
      )}
      {/* Timeline and Files tabs can be implemented similarly with real data */}
    </div>
  );
};

export default ProjectDetails;