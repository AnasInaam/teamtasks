export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      team_members: {
        Row: {
          team_id: string
          user_id: string
          role: string | null
          created_at: string | null
        }
        Insert: {
          team_id: string
          user_id: string
          role?: string | null
          created_at?: string | null
        }
        Update: {
          team_id?: string
          user_id?: string
          role?: string | null
          created_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          team_id: string | null
          status: string | null
          progress: number | null
          start_date: string | null
          due_date: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          team_id?: string | null
          status?: string | null
          progress?: number | null
          start_date?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          team_id?: string | null
          status?: string | null
          progress?: number | null
          start_date?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          project_id: string | null
          status: string | null
          priority: string | null
          due_date: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          project_id?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          project_id?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      task_assignments: {
        Row: {
          task_id: string
          user_id: string
          assigned_at: string | null
        }
        Insert: {
          task_id: string
          user_id: string
          assigned_at?: string | null
        }
        Update: {
          task_id?: string
          user_id?: string
          assigned_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}