import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Calendar, Users, AlertCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useTeams } from '../hooks/useTeams';

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().optional(),
  teamId: z.string().min(1, 'Please select a team'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.dueDate) {
    return new Date(data.startDate) <= new Date(data.dueDate);
  }
  return true;
}, {
  message: 'Due date must be after start date',
  path: ['dueDate'],
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createProject } = useProjects();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get teamId from query string
  const searchParams = new URLSearchParams(location.search);
  const preselectedTeamId = searchParams.get('teamId') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      teamId: preselectedTeamId,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: '',
    },
  });

  // If the user navigates to a different teamId, update the form
  React.useEffect(() => {
    if (preselectedTeamId) {
      setValue('teamId', preselectedTeamId);
    }
  }, [preselectedTeamId, setValue]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await createProject.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        teamId: data.teamId,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });

      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (teamsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link
          to="/projects"
          className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up a new project for your team
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-md mb-6 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error creating project</h3>
              <p className="text-sm mt-1">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              className={`input w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter project name"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`input w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Describe your project (optional)"
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Team Selection */}
          <div>
            <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team *
            </label>
            <div className="relative">
              <select
                id="teamId"
                className={`input w-full ${errors.teamId ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('teamId')}
              >
                <option value="">Select a team</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Users size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.teamId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teamId.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  id="startDate"
                  type="date"
                  className={`input w-full ${errors.startDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                  {...register('startDate')}
                />
                <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  id="dueDate"
                  type="date"
                  className={`input w-full ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                  {...register('dueDate')}
                />
                <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/projects"
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;