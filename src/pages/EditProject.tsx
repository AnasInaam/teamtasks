import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Calendar, Users, AlertCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useTeams } from '../hooks/useTeams';

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

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjects();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the project to edit
  const project = projects?.find((p) => p.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      teamId: '',
      startDate: '',
      dueDate: '',
    },
  });

  // Set form values when project loads
  useEffect(() => {
    if (project) {
      reset({
        name: project.name || '',
        description: project.description || '',
        teamId: project.team_id || '',
        startDate: project.start_date ? project.start_date.split('T')[0] : '',
        dueDate: project.due_date ? project.due_date.split('T')[0] : '',
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateProject.mutateAsync({
        id,
        name: data.name,
        description: data.description,
        team_id: data.teamId,
        start_date: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        due_date: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      });
      navigate('/projects');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Project not found</h3>
        <Link to="/projects" className="btn btn-secondary mt-4">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/projects" className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Project</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your project details</p>
        </div>
      </div>
      <div className="card">
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-md mb-6 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error updating project</h3>
              <p className="text-sm mt-1">{submitError}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name *</label>
            <input id="name" type="text" className={`input w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Enter project name" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea id="description" rows={4} className={`input w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Describe your project (optional)" {...register('description')} />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
          </div>
          <div>
            <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team *</label>
            <div className="relative">
              <select id="teamId" className={`input w-full ${errors.teamId ? 'border-red-500 focus:ring-red-500' : ''}`} {...register('teamId')}>
                <option value="">Select a team</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <Users size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.teamId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teamId.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <div className="relative">
                <input id="startDate" type="date" className={`input w-full ${errors.startDate ? 'border-red-500 focus:ring-red-500' : ''}`} {...register('startDate')} />
                <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.startDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</p>}
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
              <div className="relative">
                <input id="dueDate" type="date" className={`input w-full ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`} {...register('dueDate')} />
                <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>}
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/projects" className="btn btn-secondary">Cancel</Link>
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

export default EditProject;
