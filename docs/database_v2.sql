-- ============================================================================
--  SabiHub — Complete Database schema (v2)
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1. Core Identity
CREATE TABLE IF NOT EXISTS `users` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(120)    NOT NULL,
  `email`         VARCHAR(190)    NOT NULL,
  `password_hash` VARCHAR(255)    NOT NULL,
  `role`          ENUM('school_admin','teacher','student','parent','creator') NOT NULL,
  `status`        ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `phone`         VARCHAR(20)     NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. School Management
CREATE TABLE IF NOT EXISTS `school_profiles` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id`      BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `short_name`    VARCHAR(20)     NULL,
  `email`         VARCHAR(190)    NULL,
  `phone`         VARCHAR(20)     NULL,
  `address`       TEXT            NULL,
  `city`          VARCHAR(100)    NULL,
  `state`         VARCHAR(100)    NULL,
  `country`       VARCHAR(100)    DEFAULT 'Nigeria',
  `logo_url`      VARCHAR(255)    NULL,
  `website`       VARCHAR(255)    NULL,
  `motto`         VARCHAR(255)    NULL,
  `founded_year`  INT             NULL,
  `school_type`   VARCHAR(50)     NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_school_admin` (`admin_id`),
  CONSTRAINT `fk_school_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `campuses` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `address`       TEXT            NULL,
  `city`          VARCHAR(100)    NULL,
  `state`         VARCHAR(100)    NULL,
  `is_main`       BOOLEAN         DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_campus_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Academic Structure
CREATE TABLE IF NOT EXISTS `academic_sessions` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(20)     NOT NULL, -- e.g. 2024/2025
  `start_date`    DATE            NOT NULL,
  `end_date`      DATE            NOT NULL,
  `is_current`    BOOLEAN         DEFAULT FALSE,
  `is_active`     BOOLEAN         DEFAULT TRUE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_session_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `terms` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id`    BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(50)     NOT NULL, -- e.g. First Term
  `start_date`    DATE            NOT NULL,
  `end_date`      DATE            NOT NULL,
  `is_current`    BOOLEAN         DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_term_session` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `holidays` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `date`          DATE            NOT NULL,
  `description`   TEXT            NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_holiday_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Organization
CREATE TABLE IF NOT EXISTS `departments` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `head_teacher_id` BIGINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_dept_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dept_head`   FOREIGN KEY (`head_teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subjects` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `department_id` BIGINT UNSIGNED NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `code`          VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_subject_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subject_dept`   FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `classes` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(100)    NOT NULL, -- e.g. JSS 1
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_class_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sections` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `class_id`      BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(50)     NOT NULL, -- e.g. A, Gold
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_section_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Learning & Academic Activity
CREATE TABLE IF NOT EXISTS `courses` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `creator_id`    BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `description`   TEXT,
  `price`         DECIMAL(10,2)   DEFAULT 0.00,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_course_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lessons` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id`     BIGINT UNSIGNED NOT NULL,
  `teacher_id`    BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `content`       LONGTEXT,
  `multimedia_url` VARCHAR(255)   NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lesson_course`  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lesson_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enrollments` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `class_id`      BIGINT UNSIGNED NULL,
  `section_id`    BIGINT UNSIGNED NULL,
  `academic_session_id` BIGINT UNSIGNED NOT NULL,
  `enrolled_at`   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enrollment_period` (`student_id`, `academic_session_id`),
  CONSTRAINT `fk_enrol_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrol_class`   FOREIGN KEY (`class_id`)   REFERENCES `classes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enrol_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enrol_session` FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Assignments & Grading
CREATE TABLE IF NOT EXISTS `assignments` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id`     BIGINT UNSIGNED NOT NULL,
  `teacher_id`    BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `description`   TEXT,
  `due_date`      TIMESTAMP       NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_assign_lesson`  FOREIGN KEY (`lesson_id`)  REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assign_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `submissions` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assignment_id` BIGINT UNSIGNED NOT NULL,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `content_url`   VARCHAR(255)    NULL,
  `grade`         VARCHAR(10)     NULL,
  `feedback`      TEXT,
  `submitted_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_submission` (`assignment_id`, `student_id`),
  CONSTRAINT `fk_sub_assign`  FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_student` FOREIGN KEY (`student_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `assessment_configs` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `session_id`    BIGINT UNSIGNED NOT NULL,
  `term_id`       BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(100)    NOT NULL,
  `max_score`     INT UNSIGNED    NOT NULL DEFAULT 100,
  `weight`        INT UNSIGNED    NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_assess_school`  FOREIGN KEY (`school_id`)  REFERENCES `school_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assess_session` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assess_term`    FOREIGN KEY (`term_id`)    REFERENCES `terms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `results` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assessment_id` BIGINT UNSIGNED NOT NULL,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `subject_id`    BIGINT UNSIGNED NOT NULL,
  `score`         DECIMAL(5,2)    NOT NULL,
  `grade`         VARCHAR(5)      NULL,
  `status`        ENUM('pending', 'approved', 'rejected', 'published') DEFAULT 'pending',
  `teacher_comment` TEXT          NULL,
  `reviewed_by`   BIGINT UNSIGNED NULL,
  `submitted_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_result_entry` (`assessment_id`, `student_id`, `subject_id`),
  CONSTRAINT `fk_res_assess`  FOREIGN KEY (`assessment_id`) REFERENCES `assessment_configs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_res_student` FOREIGN KEY (`student_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_res_subject` FOREIGN KEY (`subject_id`)    REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_res_reviewer` FOREIGN KEY (`reviewed_by`)  REFERENCES `users` (`id`)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Progress & Attendance
CREATE TABLE IF NOT EXISTS `student_progress` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `lesson_id`     BIGINT UNSIGNED NOT NULL,
  `status`        ENUM('started', 'completed') NOT NULL DEFAULT 'started',
  `xp_earned`     INT UNSIGNED    DEFAULT 0,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_progress` (`student_id`, `lesson_id`),
  CONSTRAINT `fk_prog_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prog_lesson`  FOREIGN KEY (`lesson_id`)  REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `attendance` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `status`        ENUM('present', 'absent', 'late', 'excused') NOT NULL DEFAULT 'present',
  `date`          DATE            NOT NULL,
  `notes`         VARCHAR(255)    NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attendance` (`student_id`, `school_id`, `date`),
  CONSTRAINT `fk_attn_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attn_school`  FOREIGN KEY (`school_id`)  REFERENCES `school_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `attendance_corrections` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attendance_id` BIGINT UNSIGNED NOT NULL,
  `new_status`    ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  `reason`        TEXT            NOT NULL,
  `status`        ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `submitted_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_corr_attn` FOREIGN KEY (`attendance_id`) REFERENCES `attendance` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Communication & Relationship
CREATE TABLE IF NOT EXISTS `parent_child` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`     BIGINT UNSIGNED NOT NULL,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_parent_child` (`parent_id`, `student_id`),
  CONSTRAINT `fk_pc_parent`  FOREIGN KEY (`parent_id`)  REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `emergency_contacts` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL, -- usually student or parent
  `name`          VARCHAR(120)    NOT NULL,
  `phone`         VARCHAR(20)     NOT NULL,
  `relationship`  VARCHAR(50)     NOT NULL,
  `is_primary`    BOOLEAN         DEFAULT FALSE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_emerg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `announcements` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `creator_id`    BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `content`       TEXT            NOT NULL,
  `target_role`   ENUM('teacher','student','parent','all') DEFAULT 'all',
  `read_count`    INT UNSIGNED    DEFAULT 0,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ann_school`  FOREIGN KEY (`school_id`)  REFERENCES `school_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ann_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(255)    NOT NULL,
  `message`       TEXT            NOT NULL,
  `channel`       ENUM('email', 'sms', 'push', 'app') NOT NULL,
  `status`        ENUM('sent', 'failed', 'read') DEFAULT 'sent',
  `sent_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at`       TIMESTAMP       NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Timetable
CREATE TABLE IF NOT EXISTS `timetable` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`     BIGINT UNSIGNED NOT NULL,
  `class_id`      BIGINT UNSIGNED NULL,
  `section_id`    BIGINT UNSIGNED NULL,
  `subject_id`    BIGINT UNSIGNED NULL,
  `teacher_id`    BIGINT UNSIGNED NULL,
  `day`           ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time`    TIME            NOT NULL,
  `end_time`      TIME            NOT NULL,
  `room`          VARCHAR(50)     NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tt_school`  FOREIGN KEY (`school_id`)  REFERENCES `school_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tt_class`   FOREIGN KEY (`class_id`)   REFERENCES `classes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tt_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tt_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tt_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Security & Sessions
CREATE TABLE IF NOT EXISTS `revoked_tokens` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `jti`           CHAR(36)        NOT NULL,
  `user_id`       BIGINT UNSIGNED NULL,
  `expires_at`    TIMESTAMP       NOT NULL,
  `revoked_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_revoked_jti` (`jti`),
  CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `login_history` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL,
  `ip_address`    VARCHAR(45)     NOT NULL,
  `user_agent`    TEXT            NULL,
  `login_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_hist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL,
  `action`        VARCHAR(100)    NOT NULL,
  `resource`      VARCHAR(100)    NOT NULL,
  `details`       TEXT            NULL,
  `ip_address`    VARCHAR(45)     NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `alerts` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL,
  `sms_enabled`   BOOLEAN         DEFAULT FALSE,
  `email_enabled` BOOLEAN         DEFAULT TRUE,
  `phone_number`  VARCHAR(20)     NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_alert_user` (`user_id`),
  CONSTRAINT `fk_alert_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
