-- Comprehensive Correlated Seed Data for SabiHub v2
-- All passwords are 'password' (bcrypt: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)

-- 1. Users
TRUNCATE TABLE `users`;
INSERT INTO `users` (id, name, email, password_hash, role) VALUES
(1, 'Admin User', 'admin@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'school_admin'),
(2, 'Joe Teacher', 'teacher@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
(3, 'Ali Student', 'student@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(4, 'Musa Parent', 'parent@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent'),
(5, 'Sam Creator', 'creator@sabihub.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator');

-- 2. School Profile & Campus
TRUNCATE TABLE `school_profiles`;
INSERT INTO `school_profiles` (id, admin_id, name, short_name, city, state, motto) VALUES
(1, 1, 'SabiHub Premier Academy', 'SPA', 'Ife', 'Osun', 'Knowledge for the Future');

TRUNCATE TABLE `campuses`;
INSERT INTO `campuses` (id, school_id, name, address, is_main) VALUES
(1, 1, 'Main Campus', 'Road 1, OAU Quarters', 1);

-- 3. Academic Structure
TRUNCATE TABLE `academic_sessions`;
INSERT INTO `academic_sessions` (id, school_id, name, start_date, end_date, is_current) VALUES
(1, 1, '2024/2025', '2024-09-01', '2025-07-31', 1);

TRUNCATE TABLE `terms`;
INSERT INTO `terms` (id, session_id, name, start_date, end_date, is_current) VALUES
(1, 1, 'First Term', '2024-09-01', '2024-12-15', 1);

-- 4. Organization
TRUNCATE TABLE `departments`;
INSERT INTO `departments` (id, school_id, name, head_teacher_id) VALUES
(1, 1, 'Computing & Technology', 2);

TRUNCATE TABLE `subjects`;
INSERT INTO `subjects` (id, school_id, department_id, name, code) VALUES
(1, 1, 1, 'Computer Science', 'CSC101'),
(2, 1, 1, 'Web Development', 'WEB201');

TRUNCATE TABLE `classes`;
INSERT INTO `classes` (id, school_id, name) VALUES
(1, 1, 'Grade 10'),
(2, 1, 'Grade 11');

TRUNCATE TABLE `sections`;
INSERT INTO `sections` (id, class_id, name) VALUES
(1, 1, 'A'),
(2, 1, 'B');

-- 5. Courses & Lessons (Creator Sam & Teacher Joe)
TRUNCATE TABLE `courses`;
INSERT INTO `courses` (id, creator_id, title, description, price) VALUES
(1, 5, 'Intro to Programming', 'Learn the basics of coding with Python.', 10000.00),
(2, 5, 'Modern Mathematics', 'Algebra, Geometry and more.', 5000.00);

TRUNCATE TABLE `lessons`;
INSERT INTO `lessons` (id, course_id, teacher_id, title, content) VALUES
(1, 1, 2, 'Lesson 1: Hello World', 'Today we learn about print statements and variables.'),
(2, 1, 2, 'Lesson 2: Loops', 'How to repeat actions efficiently.');

-- 6. Enrollments (Ali Student)
TRUNCATE TABLE `enrollments`;
INSERT INTO `enrollments` (student_id, academic_session_id, class_id, section_id) VALUES
(3, 1, 1, 1); -- Ali is in Grade 10A

INSERT INTO `enrollments` (student_id, academic_session_id, course_id) VALUES
(3, 1, 1); -- Ali is taking the Intro to Programming course

-- 7. Parent-Child Link (Musa & Ali)
TRUNCATE TABLE `parent_child`;
INSERT INTO `parent_child` (parent_id, student_id) VALUES
(4, 3);

-- 8. Timetable
TRUNCATE TABLE `timetable`;
INSERT INTO `timetable` (id, school_id, class_id, section_id, subject_id, teacher_id, day, start_time, end_time, room) VALUES
(1, 1, 1, 1, 1, 2, 'Monday', '08:00:00', '10:00:00', 'Lab 1'),
(2, 1, 1, 1, 2, 2, 'Wednesday', '10:30:00', '12:30:00', 'Room 102');

-- 9. Assignments & Submissions
TRUNCATE TABLE `assignments`;
INSERT INTO `assignments` (id, lesson_id, teacher_id, title, description, due_date) VALUES
(1, 1, 2, 'First Python Script', 'Write a script that prints your name.', '2024-10-01 23:59:59');

TRUNCATE TABLE `submissions`;
INSERT INTO `submissions` (id, assignment_id, student_id, content_url, grade, feedback) VALUES
(1, 1, 3, 'uploads/ali_script.py', 'A', 'Excellent work, Ali!');

-- 10. Assessments & Results
TRUNCATE TABLE `assessment_configs`;
INSERT INTO `assessment_configs` (id, school_id, session_id, term_id, name, max_score, weight) VALUES
(1, 1, 1, 1, 'Mid-Term Quiz', 50, 20);

TRUNCATE TABLE `results`;
INSERT INTO `results` (id, assessment_id, student_id, subject_id, score, grade, status) VALUES
(1, 1, 3, 1, 45, 'A', 'published');

-- 11. Attendance
TRUNCATE TABLE `attendance`;
INSERT INTO `attendance` (student_id, school_id, status, date) VALUES
(3, 1, 'present', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- 12. Miscellaneous
TRUNCATE TABLE `holidays`;
INSERT INTO `holidays` (school_id, title, date, description) VALUES
(1, 'Independence Day', '2024-10-01', 'National holiday.');
