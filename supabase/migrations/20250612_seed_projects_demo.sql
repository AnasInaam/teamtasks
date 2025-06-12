-- Seed demo data for projects table (15 projects, using UUIDs for team_id)
-- Replace the UUIDs with your actual team UUIDs from the teams table

insert into projects (id, name, description, team_id, status, progress, start_date, due_date, created_by) values
('10000000-0000-0000-0000-000000000001', 'Project Apollo', 'CRM Development', '00000000-0000-0000-0000-000000000010', 'active', 10, now(), now() + interval '7 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000002', 'Project Zeus', 'Mobile App Launch', '00000000-0000-0000-0000-000000000010', 'active', 20, now(), now() + interval '8 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000003', 'Project Hera', 'Website Redesign', '00000000-0000-0000-0000-000000000010', 'active', 30, now(), now() + interval '9 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000004', 'Project Poseidon', 'Cloud Migration', '00000000-0000-0000-0000-000000000010', 'active', 40, now(), now() + interval '10 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000005', 'Project Athena', 'AI Chatbot', '00000000-0000-0000-0000-000000000010', 'active', 50, now(), now() + interval '11 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000006', 'Project Ares', 'Security Audit', '00000000-0000-0000-0000-000000000010', 'active', 60, now(), now() + interval '12 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000007', 'Project Artemis', 'Marketing Campaign', '00000000-0000-0000-0000-000000000010', 'active', 70, now(), now() + interval '13 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000008', 'Project Demeter', 'E-commerce Platform', '00000000-0000-0000-0000-000000000010', 'active', 80, now(), now() + interval '14 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000009', 'Project Dionysus', 'Event Management', '00000000-0000-0000-0000-000000000010', 'active', 90, now(), now() + interval '15 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000010', 'Project Hestia', 'Internal Tools', '00000000-0000-0000-0000-000000000010', 'active', 100, now(), now() + interval '16 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000011', 'Project Hermes', 'API Integration', '00000000-0000-0000-0000-000000000010', 'active', 10, now(), now() + interval '17 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000012', 'Project Persephone', 'Data Analytics', '00000000-0000-0000-0000-000000000010', 'active', 20, now(), now() + interval '18 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000013', 'Project Helios', 'IoT Dashboard', '00000000-0000-0000-0000-000000000010', 'active', 30, now(), now() + interval '19 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000014', 'Project Selene', 'Customer Portal', '00000000-0000-0000-0000-000000000010', 'active', 40, now(), now() + interval '20 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('10000000-0000-0000-0000-000000000015', 'Project Eros', 'Feedback System', '00000000-0000-0000-0000-000000000010', 'active', 50, now(), now() + interval '21 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1');
