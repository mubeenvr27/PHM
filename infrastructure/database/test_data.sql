-- Test data for PHM Admin Dashboard
-- Insert sample leads for testing and development

INSERT INTO leads (type, patient_name, provider_name, phone, email, condition_interest, message, source_page, status) VALUES
('referral', 'John Smith', 'Dr. Sarah Johnson', '555-0101', 'john.smith@email.com', 'Heart Failure Monitoring', 'Patient has history of CHF, needs remote monitoring setup', '/programs/heart-failure', 'new'),
('consultation', 'Mary Williams', NULL, '555-0102', 'mary.w@email.com', 'Diabetes Management', 'Interested in glucose monitoring program for Type 2 diabetes', '/programs/diabetes', 'new'),
('contact', 'Robert Brown', NULL, '555-0103', 'rbrown@email.com', 'General Inquiry', 'Would like more information about your remote monitoring services', '/contact', 'contacted'),
('referral', 'Patricia Davis', 'Dr. Michael Chen', '555-0104', 'patricia.d@email.com', 'COPD Care', 'Patient requires respiratory monitoring, currently on oxygen therapy', '/programs/copd', 'enrolled'),
('consultation', 'James Wilson', NULL, '555-0105', 'jwilson@email.com', 'Sleep Apnea', 'Interested in sleep monitoring solutions, recent diagnosis', '/programs/sleep-apnea', 'new'),
('referral', 'Linda Martinez', 'Dr. Emily Rodriguez', '555-0106', 'linda.m@email.com', 'Hypertension Monitoring', 'Patient needs daily BP monitoring, high risk', '/programs/hypertension', 'contacted'),
('contact', 'David Anderson', NULL, '555-0107', 'danderson@email.com', 'Fall Detection', 'Elderly parent needs fall detection system', '/programs/fall-detection', 'new'),
('consultation', 'Jennifer Taylor', NULL, '555-0108', 'jtaylor@email.com', 'Mental Wellness', 'Interested in mental health monitoring program', '/programs/wellness', 'closed'),
('referral', 'Michael Thomas', 'Dr. James Park', '555-0109', 'mthomas@email.com', 'Heart Failure Monitoring', 'Post-surgery patient requiring cardiac monitoring', '/programs/heart-failure', 'enrolled'),
('contact', 'Susan Jackson', NULL, '555-0110', 'sjackson@email.com', 'General Inquiry', 'Insurance coverage questions', '/contact', 'contacted');

-- Verify insertion
SELECT COUNT(*) as total_leads FROM leads;
SELECT status, COUNT(*) as count FROM leads GROUP BY status;
SELECT type, COUNT(*) as count FROM leads GROUP BY type;
