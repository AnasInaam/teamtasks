import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Users, AlertCircle } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100, 'Team name must be less than 100 characters'),
  description: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

const EditTeam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teams, updateTeam } = useTeams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the team to edit
  const team = teams?.find((t) => t.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Set form values when team loads
  useEffect(() => {
    if (team) {
      reset({
        name: team.name || '',
        description: team.description || '',
      });
    }
  }, [team, reset]);

  const onSubmit = async (data: TeamFormValues) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateTeam.mutateAsync({
        id,
        name: data.name,
        description: data.description,
      });
      navigate('/teams');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!team) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Team not found</h3>
        <Link to="/teams" className="btn btn-secondary mt-4">Back to Teams</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/teams" className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Team</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your team details</p>
        </div>
      </div>
      <div className="card">
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-md mb-6 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error updating team</h3>
              <p className="text-sm mt-1">{submitError}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name *</label>
            <input id="name" type="text" className={`input w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Enter team name" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea id="description" rows={4} className={`input w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Describe your team (optional)" {...register('description')} />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
          </div>
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/teams" className="btn btn-secondary">Cancel</Link>
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

export default EditTeam;
