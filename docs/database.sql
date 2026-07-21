-- ============================================================================
--  SabiHub — Database schema (MySQL / MariaDB)
--  Import via phpMyAdmin (Import tab) or the CLI:
--      mysql -u <db_user> -p <db_name> < database.sql
--
--  Notes for cPanel:
--   * cPanel prefixes DB and user names with your account, e.g. "cpaneluser_sabihub".
--     Create the database + user in "MySQL Databases", then import THIS file into
--     that database via phpMyAdmin. Do NOT run CREATE DATABASE here — cPanel owns that.
--   * Engine InnoDB is required for foreign keys and transactions.
--   * utf8mb4 stores full Unicode (needed for names in Hausa/Yoruba/Igbo, emoji, etc.).
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';          -- store timestamps in UTC; format for display in the app

-- ----------------------------------------------------------------------------
--  users
--  One row per account. `role` is the persona enum shared with the frontend.
--  password_hash holds a bcrypt hash from PHP password_hash(); never store plaintext.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(120)    NOT NULL,
  `email`         VARCHAR(190)    NOT NULL,                 -- 190 keeps the UNIQUE index within the utf8mb4 767-byte limit on old MySQL
  `password_hash` VARCHAR(255)    NOT NULL,                 -- bcrypt is 60 chars; 255 leaves room for future algos (argon2id)
  `role`          ENUM('school_admin','teacher','student','parent','creator') NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  revoked_tokens
--  JWTs are stateless, so /auth/logout can only "revoke" a token by recording its
--  unique id (the `jti` claim) here. me.php / logout.php check this table on every
--  authenticated request. `expires_at` = the token's own `exp`, so a scheduled
--  cron can prune rows once the token would have expired anyway.
--
--  If you prefer to skip server-side revocation (simpler, but logout becomes a
--  purely client-side token delete), you can drop this table — see BACKEND.md.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `revoked_tokens` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `jti`        CHAR(36)        NOT NULL,                    -- UUID from the token's jti claim
  `user_id`    BIGINT UNSIGNED NULL,
  `expires_at` TIMESTAMP       NOT NULL,                    -- mirror of the token exp; used for pruning
  `revoked_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_revoked_jti` (`jti`),
  KEY `idx_revoked_expires` (`expires_at`),
  CONSTRAINT `fk_revoked_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  (optional) login_attempts
--  Backing store for simple rate limiting on login/signup. One row per attempt,
--  keyed by IP (and/or email). Prune with the same cron that prunes tokens.
--  Remove if you implement rate limiting elsewhere (e.g. cPanel/ModSecurity).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip`           VARBINARY(16)   NOT NULL,                  -- inet6_pton() output (IPv4 or IPv6)
  `email`        VARCHAR(190)    NULL,
  `attempted_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_attempts_ip_time` (`ip`, `attempted_at`),
  KEY `idx_attempts_time` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  courses & lessons
--  Creators publish courses; teachers build multimedia lessons within them.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `creator_id`  BIGINT UNSIGNED NOT NULL,
  `title`       VARCHAR(255)    NOT NULL,
  `description` TEXT,
  `price`       DECIMAL(10,2)   DEFAULT 0.00,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_course_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lessons` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id`   BIGINT UNSIGNED NOT NULL,
  `teacher_id`  BIGINT UNSIGNED NOT NULL,
  `title`       VARCHAR(255)    NOT NULL,
  `content`     LONGTEXT,                                   -- HTML/Markdown/JSON lesson body
  `multimedia_url` VARCHAR(255) NULL,                       -- Link to video/audio on R2
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lesson_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lesson_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  enrollments
--  Links students to schools and the courses they are taking.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`  BIGINT UNSIGNED NOT NULL,
  `school_id`   BIGINT UNSIGNED NULL,                       -- can be null for independent students
  `course_id`   BIGINT UNSIGNED NOT NULL,
  `enrolled_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enrollment` (`student_id`, `course_id`),
  CONSTRAINT `fk_enrol_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrol_school`  FOREIGN KEY (`school_id`)  REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enrol_course`  FOREIGN KEY (`course_id`)  REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  parent_child
--  Links parent accounts to their student children.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `parent_child` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`  BIGINT UNSIGNED NOT NULL,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_parent_child` (`parent_id`, `student_id`),
  CONSTRAINT `fk_pc_parent`  FOREIGN KEY (`parent_id`)  REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  timetable
--  School administrators manage class schedules.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `timetable` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`  BIGINT UNSIGNED NOT NULL,
  `subject`    VARCHAR(100)    NOT NULL,
  `day`        ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` TIME            NOT NULL,
  `end_time`   TIME            NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_timetable_school` FOREIGN KEY (`school_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  assignments & submissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assignments` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id`   BIGINT UNSIGNED NOT NULL,
  `teacher_id`  BIGINT UNSIGNED NOT NULL,
  `title`       VARCHAR(255)    NOT NULL,
  `description` TEXT,
  `due_date`    TIMESTAMP       NULL,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_assign_lesson`  FOREIGN KEY (`lesson_id`)  REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assign_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `submissions` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assignment_id` BIGINT UNSIGNED NOT NULL,
  `student_id`    BIGINT UNSIGNED NOT NULL,
  `content_url`   VARCHAR(255)    NULL,
  `grade`         VARCHAR(10)     NULL,                     -- E.g. A, B, 85/100
  `feedback`      TEXT,
  `submitted_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_submission` (`assignment_id`, `student_id`),
  CONSTRAINT `fk_sub_assign`  FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_student` FOREIGN KEY (`student_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  Housekeeping (run via a cPanel cron job, e.g. daily):
--    DELETE FROM revoked_tokens  WHERE expires_at   < UTC_TIMESTAMP();
--    DELETE FROM login_attempts  WHERE attempted_at < (UTC_TIMESTAMP() - INTERVAL 1 DAY);
-- ----------------------------------------------------------------------------
