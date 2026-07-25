-- Seed data for SabiHub v2
-- Use this for testing purposes

INSERT INTO `users` (id, name, email, password_hash, role) VALUES
(1, 'Admin User', 'admin@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'school_admin'),
(2, 'Teacher Joe', 'teacher@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
(3, 'Student Ali', 'student@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(4, 'Parent Musa', 'parent@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent'),
(5, 'Creator Sam', 'creator@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator');

INSERT INTO `school_profiles` (id, admin_id, name, short_name, city, state) VALUES
(1, 1, 'SabiHub Demonstration School', 'SHDS', 'Ife', 'Osun');

INSERT INTO `academic_sessions` (id, school_id, name, start_date, end_date, is_current) VALUES
(1, 1, '2024/2025', '2024-09-01', '2025-07-31', 1);

INSERT INTO `terms` (id, session_id, name, start_date, end_date, is_current) VALUES
(1, 1, 'First Term', '2024-09-01', '2024-12-15', 1);

INSERT INTO `classes` (id, school_id, name) VALUES
(1, 1, 'JSS 1'),
(2, 1, 'JSS 2');

INSERT INTO `sections` (id, class_id, name) VALUES
(1, 1, 'A'),
(2, 1, 'B');

INSERT INTO `courses` (id, creator_id, title, description, price) VALUES
(1, 5, 'Mathematics Basics', 'Foundational math for JSS students.', 5000.00),
(2, 5, 'English Grammar', 'Master English grammar and composition.', 3500.00);

INSERT INTO `enrollments` (student_id, academic_session_id, class_id, section_id) VALUES
(3, 1, 1, 1);

INSERT INTO `lessons` (id, course_id, teacher_id, title, content) VALUES
(1, 1, 2, 'Introduction to Algebra', 'Lesson content about algebra variables and constants.'),
(2, 2, 2, 'Noun and Pronoun', 'Mastering parts of speech.');

INSERT INTO `parent_child` (parent_id, student_id) VALUES
(4, 3);
