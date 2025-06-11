/*
  # Fix infinite recursion in team_members RLS policies

  1. Problem
    - Current RLS policies on team_members table create infinite recursion
    - Policies reference team_members table within their own conditions
    - This causes circular dependency when evaluating permissions

  2. Solution
    - Drop existing problematic policies
    - Create new simplified policies that avoid self-reference
    - Use direct user ID checks instead of complex subqueries

  3. New Policies
    - Allow users to view their own memberships directly
    - Allow team creators to manage memberships through teams table
    - Allow users to insert their own memberships
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team creators can manage team memberships" ON team_members;
DROP POLICY IF EXISTS "Team members can view team memberships" ON team_members;
DROP POLICY IF EXISTS "Users can insert their own team memberships" ON team_members;
DROP POLICY IF EXISTS "Users can view their own team memberships" ON team_members;

-- Create new simplified policies that avoid recursion

-- Policy 1: Users can view their own team memberships
CREATE POLICY "Users can view own memberships"
  ON team_members
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert themselves as team members
CREATE POLICY "Users can join teams"
  ON team_members
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Team creators can manage all team memberships for their teams
CREATE POLICY "Team creators manage memberships"
  ON team_members
  FOR ALL
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

-- Policy 4: Users can delete their own memberships (leave teams)
CREATE POLICY "Users can leave teams"
  ON team_members
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);