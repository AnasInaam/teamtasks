import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamWithMembers = Team & {
  members: Array<{
    user: {
      id: string;
      name: string;
      avatar_url: string | null;
      role: string | null;
    };
  }>;
};

export function useTeams() {
  const queryClient = useQueryClient();

  // Subscribe to real-time changes
  React.useEffect(() => {
    const subscription = supabase
      .channel('teams_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'teams'
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['teams'] });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Fetch teams
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(
            user:profiles(
              id,
              name,
              avatar_url,
              role
            )
          )
        `);

      if (error) throw error;

      return teams as TeamWithMembers[];
    }
  });

  // Create team
  const createTeam = useMutation({
    mutationFn: async (newTeam: { name: string; description?: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([
          {
            name: newTeam.name,
            description: newTeam.description,
            created_by: user.user.id
          }
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add the creator as a team member with leader role
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([
          {
            team_id: team.id,
            user_id: user.user.id,
            role: 'leader'
          }
        ]);

      if (memberError) throw memberError;

      return team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  // Update team
  const updateTeam = useMutation({
    mutationFn: async (team: Partial<Team> & { id: string }) => {
      const { data, error } = await supabase
        .from('teams')
        .update(team)
        .eq('id', team.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  // Delete team
  const deleteTeam = useMutation({
    mutationFn: async (teamId: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  return {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam
  };
}