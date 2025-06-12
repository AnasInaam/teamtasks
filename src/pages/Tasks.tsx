import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, SortAsc, Grid, List, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import TaskCard from '../components/ui/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus, TaskPriority } from '../types/task';

const statusList: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Reset page when filters/search change
  React.useEffect(() => { setPage(1); }, [searchTerm, statusFilter, priorityFilter]);

  const { tasks, isLoading, error, deleteTask } = useTasks({
    page,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    // priority: priorityFilter !== 'all' ? priorityFilter : undefined, // Uncomment if backend supports priority filtering
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Group tasks by status for stats
  const taskStats: Record<TaskStatus, number> = {
    todo: 0,
    'in-progress': 0,
    review: 0,
    done: 0
  };
  (tasks || []).forEach(task => {
    if (task.status && statusList.includes(task.status as TaskStatus)) {
      taskStats[task.status as TaskStatus]++;
    }
  });

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  // Delete handler
  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    setDeletingId(taskId);
    try {
      await deleteTask.mutateAsync(taskId);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading tasks</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your assigned tasks
          </p>
        </div>
        
        <Link 
          to="/tasks/new"
          className="btn btn-primary inline-flex whitespace-nowrap"
        >
          <Plus size={18} className="mr-1" />
          New Task
        </Link>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-center">
          <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">To Do</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {taskStats.todo}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
            <Clock size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {taskStats['in-progress']}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
            <AlertTriangle size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Review</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {taskStats.review}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Done</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {taskStats.done}
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="input py-2 pl-10"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="input py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          
          <select
            className="input py-2"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <button className="btn btn-secondary">
            <SortAsc size={18} className="mr-1.5" />
            Sort
          </button>
          
          {/* View Toggle */}
          <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`p-2 ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Tasks Grid */}
      {tasks && tasks.length > 0 ? (
        <>
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {tasks.map((task) => (
              <div key={task.id} className="relative group">
                <TaskCard
                  task={{
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
                    commentCount: 0, // We'll need to add this to the query
                    attachmentCount: 0 // We'll need to add this to the query
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="btn btn-xs btn-secondary"
                    title="Edit Task"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-xs btn-danger"
                    title="Delete Task"
                    disabled={deletingId === task.id}
                    onClick={() => handleDelete(task.id)}
                  >
                    {deletingId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button className="btn btn-secondary" onClick={handlePrev} disabled={page === 1}>Previous</button>
            <span className="self-center">Page {page}</span>
            <button className="btn btn-secondary" onClick={handleNext} disabled={!tasks || tasks.length < pageSize}>Next</button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <CheckCircle2 size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            We couldn't find any tasks matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="btn btn-secondary"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;