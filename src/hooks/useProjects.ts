import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectWithTeam = Project & {
  team: {
    name: string;
    members: Array<{
      user: {
        id: string;
        name: string;
        avatar_url: string | null;
        role: string | null;
      };
    }>;
  } | null;
  taskCount?: number;
};

export interface UseProjectsOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  teamId?: string;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const { page = 1, pageSize = 10, searchTerm, teamId } = options;
  const queryClient = useQueryClient();

  // Subscribe to real-time changes
  React.useEffect(() => {
    const subscription = supabase
      .channel('projects_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, (_payload: any) => {
        queryClient.invalidateQueries({ queryKey: ['projects', options] });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, options]);

  // Fetch projects with pagination and filtering
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', options],
    queryFn: async () => {
      // Fetch projects with team info
      let query = supabase
        .from('projects')
        .select(`
          *,
          team:teams(
            name,
            members:team_members(
              user:profiles(
                id,
                name,
                avatar_url,
                role
              )
            )
          )
        `);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) {
        throw new Error(error.message || 'Failed to fetch projects');
      }
      // For each project, fetch the task count
      const projectIds = (data as ProjectWithTeam[]).map(p => p.id);
      let taskCounts: Record<string, number> = {};
      if (projectIds.length > 0) {
        const { data: taskCountData, error: taskCountError } = await supabase
          .from('tasks')
          .select('project_id, count:id', { groupBy: 'project_id' })
          .in('project_id', projectIds);
        if (!taskCountError && Array.isArray(taskCountData)) {
          for (const row of taskCountData) {
            taskCounts[row.project_id] = row.count;
          }
        }
      }
      return (data as ProjectWithTeam[]).map(p => ({ ...p, taskCount: taskCounts[p.id] || 0 }));
    },
    enabled: true
  });

  // Create project
  const createProject = useMutation({
    mutationFn: async (newProject: {
      name: string;
      description?: string;
      teamId: string;
      startDate?: Date;
      dueDate?: Date;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: newProject.name,
            description: newProject.description,
            team_id: newProject.teamId,
            start_date: newProject.startDate?.toISOString(),
            due_date: newProject.dueDate?.toISOString(),
            created_by: user.user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  // Update project
  const updateProject = useMutation({
    mutationFn: async (project: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  // Delete project
  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject
  };
}