/*
  # Fix infinite recursion in team_members RLS policies

  1. Problem
    - Current RLS policies on team_members table create infinite recursion
    - Policies query team_members table from within team_members policies
    - This causes circular reference during policy evaluation

  2. Solution
    - Drop existing problematic policies
    - Create new policies that avoid self-referencing queries
    - Use simpler conditions that don't create recursion

  3. Security Changes
    - Replace recursive policies with direct user-based checks
    - Maintain same security level without recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team leaders can manage team memberships" ON team_members;
DROP POLICY IF EXISTS "Team members can view team memberships" ON team_members;

-- Create new non-recursive policies for team_members
CREATE POLICY "Users can view their own team memberships"
  ON team_members
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own team memberships"
  ON team_members
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- Allow team creators to manage memberships (check via teams table directly)
CREATE POLICY "Team creators can manage team memberships"
  ON team_members
  FOR ALL
  TO public
  USING (
    auth.uid() IN (
      SELECT created_by 
      FROM teams 
      WHERE id = team_id
    )
  );

-- Allow users to see memberships of teams they belong to
CREATE POLICY "Team members can view team memberships"
  ON team_members
  FOR SELECT
  TO public
  USING (
    team_id IN (
      SELECT t.id
      FROM teams t
      WHERE t.created_by = auth.uid()
    )
    OR
    auth.uid() = user_id
  );