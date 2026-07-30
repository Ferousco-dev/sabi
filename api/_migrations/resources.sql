-- Migration: teaching resources table (referenced by api/teacher/resources.php)
-- NOT YET APPLIED. Matches the Resource frontend contract in app/lib/api/teacher.ts:
--   { id, teacher_id, title, url, type, topic?, created_at }

CREATE TABLE IF NOT EXISTS `resources` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id`  BIGINT UNSIGNED NOT NULL,
  `title`       VARCHAR(255)    NOT NULL,
  `url`         VARCHAR(500)    NOT NULL,
  `type`        VARCHAR(50)     NOT NULL,
  `topic`       VARCHAR(255)    NULL,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resources_teacher` (`teacher_id`),
  CONSTRAINT `fk_resource_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
