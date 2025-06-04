/*
  # Initial Schema Setup for TeamTasks

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to auth.users
      - Contains name, avatar_url, and role
    
    - `teams`
      - Stores team information
      - Contains name, description, and created_by
    
    - `team_members`
      - Junction table for team memberships
      - Links users to teams with roles
    
    - `projects`
      - Stores project information
      - Contains name, description, team_id, status, etc.
    
    - `tasks`
      - Stores task information
      - Contains title, description, status, priority, etc.
    
    - `task_assignments`
      - Junction table for task assignments
      - Links users to tasks
    
  2. Security
    - Enable RLS on all tables
    - Set up policies for each table
    - Ensure proper access control
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  progress integer DEFAULT 0,
  start_date timestamptz DEFAULT now(),
  due_date timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  due_date timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task_assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Team members can view their teams"
  ON teams FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM team_members 
      WHERE team_id = teams.id
    )
  );

CREATE POLICY "Team creators can update their teams"
  ON teams FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Team members policies
CREATE POLICY "Team members can view team memberships"
  ON team_members FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM team_members 
      WHERE team_id = team_members.team_id
    )
  );

CREATE POLICY "Team leaders can manage team memberships"
  ON team_members FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM team_members 
      WHERE team_id = team_members.team_id 
      AND role = 'leader'
    )
  );

-- Projects policies
CREATE POLICY "Team members can view their team's projects"
  ON projects FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM team_members 
      WHERE team_id = projects.team_id
    )
  );

CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM team_members 
      WHERE team_id = projects.team_id
    )
  );

CREATE POLICY "Project creators can update their projects"
  ON projects FOR UPDATE
  USING (auth.uid() = created_by);

-- Tasks policies
CREATE POLICY "Team members can view tasks"
  ON tasks FOR SELECT
  USING (
    auth.uid() IN (
      SELECT tm.user_id 
      FROM team_members tm
      JOIN projects p ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
    )
  );

CREATE POLICY "Team members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT tm.user_id 
      FROM team_members tm
      JOIN projects p ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
    )
  );

CREATE POLICY "Task creators and assignees can update tasks"
  ON tasks FOR UPDATE
  USING (
    auth.uid() = created_by OR
    auth.uid() IN (
      SELECT user_id 
      FROM task_assignments 
      WHERE task_id = tasks.id
    )
  );

-- Task assignments policies
CREATE POLICY "Team members can view task assignments"
  ON task_assignments FOR SELECT
  USING (
    auth.uid() IN (
      SELECT tm.user_id 
      FROM team_members tm
      JOIN projects p ON p.team_id = tm.team_id
      JOIN tasks t ON t.project_id = p.id
      WHERE t.id = task_assignments.task_id
    )
  );

CREATE POLICY "Team leaders can manage task assignments"
  ON task_assignments FOR ALL
  USING (
    auth.uid() IN (
      SELECT tm.user_id 
      FROM team_members tm
      JOIN projects p ON p.team_id = tm.team_id
      JOIN tasks t ON t.project_id = p.id
      WHERE t.id = task_assignments.task_id
      AND tm.role = 'leader'
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE task_assignments;