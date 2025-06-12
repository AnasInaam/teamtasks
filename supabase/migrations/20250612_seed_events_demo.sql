-- Seed demo data for events table (15 events)
insert into events (id, team_id, title, description, date, duration, type, created_by) values
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Kickoff Meeting', 'Initial project kickoff', now() + interval '1 day', 60, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Sprint Planning', 'Plan next sprint', now() + interval '2 days', 90, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec2'),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000010', 'Demo Day', 'Showcase progress', now() + interval '3 days', 30, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec3'),
('60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', 'Retrospective', 'Sprint review', now() + interval '4 days', 45, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec4'),
('60000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000010', 'Design Review', 'Review UI/UX', now() + interval '5 days', 60, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec5'),
('60000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000010', 'Client Call', 'Call with client', now() + interval '6 days', 30, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec6'),
('60000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000010', 'Deployment', 'Production deployment', now() + interval '7 days', 120, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec7'),
('60000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000010', 'Bug Bash', 'Find and fix bugs', now() + interval '8 days', 60, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec8'),
('60000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000010', 'Marketing Sync', 'Marketing team sync', now() + interval '9 days', 30, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec9'),
('60000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'Sales Review', 'Review sales pipeline', now() + interval '10 days', 45, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0beca'),
('60000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000010', 'All Hands', 'Company-wide meeting', now() + interval '11 days', 60, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becb'),
('60000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000010', 'Product Demo', 'Demo for stakeholders', now() + interval '12 days', 30, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becc'),
('60000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000010', 'Feature Launch', 'Launch new feature', now() + interval '13 days', 90, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becd'),
('60000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000010', 'Support Sync', 'Support team sync', now() + interval '14 days', 30, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bece'),
('60000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000010', 'Wrap Up', 'Project wrap up', now() + interval '15 days', 60, 'meeting', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becf');
