import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Task title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.string().min(1),
  priority: z.string().min(1),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask } = useTasks();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the task to edit
  const task = tasks?.find((t) => t.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    },
  });

  // Set form values when task loads
  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateTask.mutateAsync({
        id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        due_date: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      });
      navigate('/tasks');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Task not found</h3>
        <Link to="/tasks" className="btn btn-secondary mt-4">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/tasks" className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Task</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your task details</p>
        </div>
      </div>
      <div className="card">
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-md mb-6 flex items-start">
            <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error updating task</h3>
              <p className="text-sm mt-1">{submitError}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task Title *</label>
            <input id="title" type="text" className={`input w-full ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Enter task title" {...register('title')} />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea id="description" rows={4} className={`input w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Describe your task (optional)" {...register('description')} />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select id="status" className={`input w-full ${errors.status ? 'border-red-500 focus:ring-red-500' : ''}`} {...register('status')}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>}
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select id="priority" className={`input w-full ${errors.priority ? 'border-red-500 focus:ring-red-500' : ''}`} {...register('priority')}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
            <input id="dueDate" type="date" className={`input w-full ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`} {...register('dueDate')} />
            {errors.dueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>}
          </div>
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/tasks" className="btn btn-secondary">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
