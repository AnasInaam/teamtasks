import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectWithTeam = Project & {
  team: {
    name: string;
  };
  members: Array<{
    id: string;
    name: string;
    avatar_url: string | null;
    role: string | null;
  }>;
};

export function useProjects(teamId?: string) {
  const queryClient = useQueryClient();

  // Subscribe to real-time changes
  React.useEffect(() => {
    const subscription = supabase
      .channel('projects_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, teamId]);

  // Fetch projects
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', teamId],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          team:teams(name),
          members:team_members(
            user:profiles(
              id,
              name,
              avatar_url,
              role
            )
          )
        `);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ProjectWithTeam[];
    },
    enabled: !teamId || !!teamId
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
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: newProject.name,
            description: newProject.description,
            team_id: newProject.teamId,
            start_date: newProject.startDate?.toISOString(),
            due_date: newProject.dueDate?.toISOString(),
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
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
      queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
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
      queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
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