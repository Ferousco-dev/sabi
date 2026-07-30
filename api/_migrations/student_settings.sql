-- Intended schema for student notification + accessibility preferences.
-- NOT YET APPLIED. api/student/settings.php returns defaults / no-ops until this
-- table exists. One row per student.
CREATE TABLE IF NOT EXISTS `student_settings` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`       BIGINT UNSIGNED NOT NULL,
  `notify_email`     BOOLEAN NOT NULL DEFAULT TRUE,
  `notify_sms`       BOOLEAN NOT NULL DEFAULT FALSE,
  `notify_push`      BOOLEAN NOT NULL DEFAULT TRUE,
  `high_contrast`    BOOLEAN NOT NULL DEFAULT FALSE,
  `large_text`       BOOLEAN NOT NULL DEFAULT FALSE,
  `reduce_motion`    BOOLEAN NOT NULL DEFAULT FALSE,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_student_settings` (`student_id`),
  CONSTRAINT `fk_settings_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
