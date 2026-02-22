-- =============================================================================
-- Lordaeron Website — Password Reset Tokens
-- Database: lordaeron_website
-- Run this script on the production database to create the table.
-- =============================================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  account_id    INT UNSIGNED NOT NULL,
  token_hash    VARCHAR(64)  NOT NULL,      -- SHA-256 du token brut
  email         VARCHAR(255) NOT NULL,
  locale        VARCHAR(5)   NOT NULL DEFAULT 'en',
  is_used       TINYINT(1)   NOT NULL DEFAULT 0,
  expires_at    TIMESTAMP    NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX idx_token_hash (token_hash),
  INDEX idx_account_id (account_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
