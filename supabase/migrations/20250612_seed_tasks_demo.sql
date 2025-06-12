-- Seed demo data for tasks table (15 demo tasks, all linked to demo projects and users)
insert into tasks (id, title, description, project_id, status, priority, due_date, created_by) values
('20000000-0000-0000-0000-000000000001', 'Design Wireframes', 'Create wireframes for the CRM UI', '10000000-0000-0000-0000-000000000001', 'todo', 'high', now() + interval '1 day', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1'),
('20000000-0000-0000-0000-000000000002', 'Setup Database', 'Setup PostgreSQL schema', '10000000-0000-0000-0000-000000000001', 'in_progress', 'medium', now() + interval '2 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec2'),
('20000000-0000-0000-0000-000000000003', 'Write API Docs', 'Document all endpoints', '10000000-0000-0000-0000-000000000002', 'todo', 'low', now() + interval '3 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec3'),
('20000000-0000-0000-0000-000000000004', 'Implement Auth', 'Add authentication to app', '10000000-0000-0000-0000-000000000002', 'done', 'high', now() + interval '4 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec4'),
('20000000-0000-0000-0000-000000000005', 'Create Landing Page', 'Landing page for marketing', '10000000-0000-0000-0000-000000000003', 'todo', 'medium', now() + interval '5 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec5'),
('20000000-0000-0000-0000-000000000006', 'SEO Optimization', 'Improve SEO for site', '10000000-0000-0000-0000-000000000003', 'in_progress', 'medium', now() + interval '6 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec6'),
('20000000-0000-0000-0000-000000000007', 'Migrate Data', 'Migrate legacy data', '10000000-0000-0000-0000-000000000004', 'todo', 'high', now() + interval '7 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec7'),
('20000000-0000-0000-0000-000000000008', 'Setup CI/CD', 'Configure CI/CD pipeline', '10000000-0000-0000-0000-000000000004', 'done', 'medium', now() + interval '8 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec8'),
('20000000-0000-0000-0000-000000000009', 'Train Model', 'Train ML model', '10000000-0000-0000-0000-000000000005', 'todo', 'high', now() + interval '9 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec9'),
('20000000-0000-0000-0000-000000000010', 'Deploy Bot', 'Deploy chatbot to prod', '10000000-0000-0000-0000-000000000005', 'in_progress', 'high', now() + interval '10 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0beca'),
('20000000-0000-0000-0000-000000000011', 'Penetration Testing', 'Security testing', '10000000-0000-0000-0000-000000000006', 'todo', 'high', now() + interval '11 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becb'),
('20000000-0000-0000-0000-000000000012', 'Ad Campaign', 'Launch ad campaign', '10000000-0000-0000-0000-000000000007', 'done', 'medium', now() + interval '12 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becc'),
('20000000-0000-0000-0000-000000000013', 'Product Listing', 'List products on site', '10000000-0000-0000-0000-000000000008', 'todo', 'medium', now() + interval '13 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becd'),
('20000000-0000-0000-0000-000000000014', 'Event Setup', 'Setup for event', '10000000-0000-0000-0000-000000000009', 'in_progress', 'low', now() + interval '14 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bece'),
('20000000-0000-0000-0000-000000000015', 'Tool Documentation', 'Document internal tools', '10000000-0000-0000-0000-000000000010', 'todo', 'medium', now() + interval '15 days', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becf');
