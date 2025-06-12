-- Seed demo data for TeamTasks
-- Replace UUIDs with actual values from your Supabase project if needed

-- Insert a demo team
insert into teams (id, name, description, created_by) values ('00000000-0000-0000-0000-000000000010', 'Demo Team', 'A team for demo purposes', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');

-- Add the user as a team member (leader)
insert into team_members (team_id, user_id, role) values ('00000000-0000-0000-0000-000000000010', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1', 'leader');

-- Insert a demo project
insert into projects (id, name, description, team_id, status, progress, start_date, due_date, created_by) values ('00000000-0000-0000-0000-000000000100', 'Demo Project', 'A project for demo', '00000000-0000-0000-0000-000000000010', 'active', 10, now(), now() + interval '7 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');

-- Insert a demo task
insert into tasks (id, title, description, project_id, status, priority, due_date, created_by) values ('00000000-0000-0000-0000-000000001000', 'Demo Task', 'A task for demo', '00000000-0000-0000-0000-000000000100', 'todo', 'medium', now() + interval '3 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');

-- Assign the user to the task
insert into task_assignments (task_id, user_id) values ('00000000-0000-0000-0000-000000001000', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');

-- Insert a comment
insert into comments (id, user_id, target_type, target_id, content) values (gen_random_uuid(), 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1', 'task', '00000000-0000-0000-0000-000000001000', 'This is a demo comment.');

-- Insert an attachment
insert into attachments (id, user_id, target_type, target_id, file_url, file_name, file_type, file_size) values (gen_random_uuid(), 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1', 'task', '00000000-0000-0000-0000-000000001000', 'https://example.com/file.pdf', 'file.pdf', 'application/pdf', 12345);

-- Insert a notification
insert into notifications (id, user_id, type, message, data) values (gen_random_uuid(), 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1', 'info', 'Welcome to TeamTasks!', '{}');

-- Insert an event
insert into events (id, team_id, title, description, date, duration, type, created_by) values ('00000000-0000-0000-0000-000000002000', '00000000-0000-0000-0000-000000000010', 'Demo Meeting', 'Kickoff meeting', now() + interval '1 day', 60, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');

-- Add the user as an event attendee
insert into event_attendees (event_id, user_id) values ('00000000-0000-0000-0000-000000002000', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');
