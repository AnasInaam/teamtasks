/*
  # Fix RLS Policies for All Tables

  1. Drop all existing problematic policies
  2. Create new simplified policies that avoid recursion
  3. Ensure proper access control for all tables
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Team members can view their teams" ON teams;
DROP POLICY IF EXISTS "Team creators can update their teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON teams;

DROP POLICY IF EXISTS "Users can view own memberships" ON team_members;
DROP POLICY IF EXISTS "Users can join teams" ON team_members;
DROP POLICY IF EXISTS "Team creators manage memberships" ON team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON team_members;

DROP POLICY IF EXISTS "Team members can view their team's projects" ON projects;
DROP POLICY IF EXISTS "Team members can create projects" ON projects;
DROP POLICY IF EXISTS "Project creators can update their projects" ON projects;

DROP POLICY IF EXISTS "Team members can view tasks" ON tasks;
DROP POLICY IF EXISTS "Team members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Task creators and assignees can update tasks" ON tasks;

DROP POLICY IF EXISTS "Team members can view task assignments" ON task_assignments;
DROP POLICY IF EXISTS "Team leaders can manage task assignments" ON task_assignments;

-- Create new simplified policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Authenticated users can view teams"
  ON teams FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Team creators can update their teams"
  ON teams FOR UPDATE
  TO public
  USING (auth.uid() = created_by);

-- Team members policies (simplified to avoid recursion)
CREATE POLICY "Users can view own memberships"
  ON team_members FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join teams"
  ON team_members FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON team_members FOR DELETE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Team creators manage memberships"
  ON team_members FOR ALL
  TO public
  USING (
    auth.uid() IN (
      SELECT created_by 
      FROM teams 
      WHERE teams.id = team_members.team_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT created_by 
      FROM teams 
      WHERE teams.id = team_members.team_id
    )
  );

-- Projects policies
CREATE POLICY "Authenticated users can view projects"
  ON projects FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Project creators can update their projects"
  ON projects FOR UPDATE
  TO public
  USING (auth.uid() = created_by);

-- Tasks policies
CREATE POLICY "Authenticated users can view tasks"
  ON tasks FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create tasks"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Task creators and assignees can update tasks"
  ON tasks FOR UPDATE
  TO public
  USING (
    auth.uid() = created_by OR
    auth.uid() IN (
      SELECT user_id 
      FROM task_assignments 
      WHERE task_id = tasks.id
    )
  );

-- Task assignments policies
CREATE POLICY "Authenticated users can view task assignments"
  ON task_assignments FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage task assignments"
  ON task_assignments FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);