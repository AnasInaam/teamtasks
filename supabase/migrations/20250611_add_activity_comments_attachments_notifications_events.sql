-- Add activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL, -- e.g., 'task', 'project', 'team'
  target_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_type text NOT NULL, -- 'task' or 'project'
  target_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_type text NOT NULL, -- 'task' or 'project'
  target_id uuid NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text,
  file_size integer,
  created_at timestamptz DEFAULT now()
);

-- Add notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add events table (for calendar/meetings)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  duration integer,
  type text NOT NULL, -- 'meeting', 'deadline', 'reminder'
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Event attendees (many-to-many)
CREATE TABLE IF NOT EXISTS event_attendees (
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, user_id)
);

-- Enable RLS and add policies for new tables
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Policies for activity_log
DROP POLICY IF EXISTS "Team members can view activity log" ON activity_log;
CREATE POLICY "Team members can view activity log" ON activity_log FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = activity_log.team_id));
DROP POLICY IF EXISTS "Users can insert their own activity log" ON activity_log;
CREATE POLICY "Users can insert their own activity log" ON activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for comments
DROP POLICY IF EXISTS "Team members can view comments" ON comments;
CREATE POLICY "Team members can view comments" ON comments FOR SELECT
  USING (auth.uid() IN (
    SELECT tm.user_id FROM team_members tm
    JOIN projects p ON (comments.target_type = 'project' AND p.id = comments.target_id AND p.team_id = tm.team_id)
    JOIN tasks t ON (comments.target_type = 'task' AND t.id = comments.target_id)
    WHERE tm.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
CREATE POLICY "Users can insert their own comments" ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for attachments
DROP POLICY IF EXISTS "Team members can view attachments" ON attachments;
CREATE POLICY "Team members can view attachments" ON attachments FOR SELECT
  USING (auth.uid() IN (
    SELECT tm.user_id FROM team_members tm
    JOIN projects p ON (attachments.target_type = 'project' AND p.id = attachments.target_id AND p.team_id = tm.team_id)
    JOIN tasks t ON (attachments.target_type = 'task' AND t.id = attachments.target_id)
    WHERE tm.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "Users can insert their own attachments" ON attachments;
CREATE POLICY "Users can insert their own attachments" ON attachments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for notifications
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
CREATE POLICY "Users can insert their own notifications" ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for events
DROP POLICY IF EXISTS "Team members can view events" ON events;
CREATE POLICY "Team members can view events" ON events FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = events.team_id));
DROP POLICY IF EXISTS "Team members can insert events" ON events;
CREATE POLICY "Team members can insert events" ON events FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = events.team_id));

-- Policies for event_attendees
DROP POLICY IF EXISTS "Event attendees can view their events" ON event_attendees;
CREATE POLICY "Event attendees can view their events" ON event_attendees FOR SELECT
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Event attendees can insert themselves" ON event_attendees;
CREATE POLICY "Event attendees can insert themselves" ON event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);
