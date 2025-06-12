import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskWithAssignees = Task & {
  assignees: Array<{
    user: {
      id: string;
      name: string;
      avatar_url: string | null;
      role: string | null;
    };
  }>;
};

export interface UseTasksOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  searchTerm?: string;
  projectId?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { page = 1, pageSize = 10, status, searchTerm, projectId } = options;
  const queryClient = useQueryClient();

  // Subscribe to real-time changes
  React.useEffect(() => {
    const subscription = supabase
      .channel('tasks_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, (_payload: any) => {
        queryClient.invalidateQueries({ queryKey: ['tasks', options] });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, options]);

  // Fetch tasks with pagination and filtering
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', options],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignees:task_assignments(
            user:profiles(
              id,
              name,
              avatar_url,
              role
            )
          )
        `);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) {
        // Improved error handling
        throw new Error(error.message || 'Failed to fetch tasks');
      }
      return data as TaskWithAssignees[];
    },
    enabled: true
  });

  // Create task
  const createTask = useMutation({
    mutationFn: async (newTask: {
      title: string;
      description?: string;
      projectId: string;
      status?: string;
      priority?: string;
      dueDate?: Date;
      assigneeIds?: string[];
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([
          {
            title: newTask.title,
            description: newTask.description,
            project_id: newTask.projectId,
            status: newTask.status || 'todo',
            priority: newTask.priority || 'medium',
            due_date: newTask.dueDate?.toISOString(),
            created_by: user.user.id
          }
        ])
        .select()
        .single();

      if (taskError) throw taskError;

      if (newTask.assigneeIds?.length) {
        const { error: assignmentError } = await supabase
          .from('task_assignments')
          .insert(
            newTask.assigneeIds.map(userId => ({
              task_id: task.id,
              user_id: userId
            }))
          );

        if (assignmentError) throw assignmentError;
      }

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // Update task
  const updateTask = useMutation({
    mutationFn: async (task: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask
  };
}