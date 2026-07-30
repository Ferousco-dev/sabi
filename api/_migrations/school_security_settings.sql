-- Intended schema for per-school security settings.
-- NOT YET APPLIED. api/schools/security.php returns defaults and accepts POST
-- updates as a no-op until this table exists. One row per school.
CREATE TABLE IF NOT EXISTS `school_security_settings` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_id`           BIGINT UNSIGNED NOT NULL,
  `two_factor_enabled`  BOOLEAN NOT NULL DEFAULT FALSE,
  `password_policy`     VARCHAR(50) NOT NULL DEFAULT 'standard',
  `session_timeout`     INT UNSIGNED NOT NULL DEFAULT 60, -- minutes
  `updated_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_school_security` (`school_id`),
  CONSTRAINT `fk_security_school` FOREIGN KEY (`school_id`) REFERENCES `school_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
