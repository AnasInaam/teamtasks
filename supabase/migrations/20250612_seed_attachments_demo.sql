-- Seed demo data for attachments table (15 attachments)
insert into attachments (id, user_id, target_type, target_id, file_url, file_name, file_type, file_size) values
('40000000-0000-0000-0000-000000000001', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec1', 'task', '20000000-0000-0000-0000-000000000001', 'https://example.com/file1.pdf', 'file1.pdf', 'application/pdf', 12345),
('40000000-0000-0000-0000-000000000002', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec2', 'task', '20000000-0000-0000-0000-000000000002', 'https://example.com/file2.docx', 'file2.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23456),
('40000000-0000-0000-0000-000000000003', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec3', 'task', '20000000-0000-0000-0000-000000000003', 'https://example.com/file3.png', 'file3.png', 'image/png', 34567),
('40000000-0000-0000-0000-000000000004', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec4', 'task', '20000000-0000-0000-0000-000000000004', 'https://example.com/file4.jpg', 'file4.jpg', 'image/jpeg', 45678),
('40000000-0000-0000-0000-000000000005', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec5', 'task', '20000000-0000-0000-0000-000000000005', 'https://example.com/file5.xls', 'file5.xls', 'application/vnd.ms-excel', 56789),
('40000000-0000-0000-0000-000000000006', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec6', 'task', '20000000-0000-0000-0000-000000000006', 'https://example.com/file6.ppt', 'file6.ppt', 'application/vnd.ms-powerpoint', 67890),
('40000000-0000-0000-0000-000000000007', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec7', 'task', '20000000-0000-0000-0000-000000000007', 'https://example.com/file7.txt', 'file7.txt', 'text/plain', 78901),
('40000000-0000-0000-0000-000000000008', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec8', 'task', '20000000-0000-0000-0000-000000000008', 'https://example.com/file8.csv', 'file8.csv', 'text/csv', 89012),
('40000000-0000-0000-0000-000000000009', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bec9', 'task', '20000000-0000-0000-0000-000000000009', 'https://example.com/file9.zip', 'file9.zip', 'application/zip', 90123),
('40000000-0000-0000-0000-000000000010', 'bfcc2df1-ea2b-4581-995f-5b6d89f0beca', 'task', '20000000-0000-0000-0000-000000000010', 'https://example.com/file10.mp4', 'file10.mp4', 'video/mp4', 101234),
('40000000-0000-0000-0000-000000000011', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becb', 'task', '20000000-0000-0000-0000-000000000011', 'https://example.com/file11.pdf', 'file11.pdf', 'application/pdf', 112345),
('40000000-0000-0000-0000-000000000012', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becc', 'task', '20000000-0000-0000-0000-000000000012', 'https://example.com/file12.docx', 'file12.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 123456),
('40000000-0000-0000-0000-000000000013', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becd', 'task', '20000000-0000-0000-0000-000000000013', 'https://example.com/file13.png', 'file13.png', 'image/png', 134567),
('40000000-0000-0000-0000-000000000014', 'bfcc2df1-ea2b-4581-995f-5b6d89f0bece', 'task', '20000000-0000-0000-0000-000000000014', 'https://example.com/file14.jpg', 'file14.jpg', 'image/jpeg', 145678),
('40000000-0000-0000-0000-000000000015', 'bfcc2df1-ea2b-4581-995f-5b6d89f0becf', 'task', '20000000-0000-0000-0000-000000000015', 'https://example.com/file15.xls', 'file15.xls', 'application/vnd.ms-excel', 156789);
