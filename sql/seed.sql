-- =============================================================================
-- Lordaeron Website — Seed Data (DML)
-- =============================================================================

-- ── 1. Admin account ─────────────────────────────────────────────────────────
-- Database: lordaeron_website

INSERT INTO shop_admins (username, password_hash, display_name, role) VALUES
('admin', '$2b$10$8RFJh7tJWezJ4hTVh9dW/e.cqmH574YwON9oHuVJGeM8/o2FIskl6', 'Administrator', 'super_admin');

-- ── 2. SOAP account for website shop delivery ────────────────────────────────
-- Database: auth
-- Generated via: pnpm exec tsx sql/generators/generate-soap-account.ts

INSERT INTO `account` (`username`, `salt`, `verifier`, `email`, `expansion`)
VALUES ('SOAPWEBSITE', X'2ec210a925754113fb1a24c3b24e00948dea3786de5720181d736af7a4aaaeff', X'971318e1a6b29dd40a73d6cf80d65de0ca8a62ba0a7f052e29d10c28224bb64a', 'soap@lordaeron.local', 2);

INSERT INTO `account_access` (`AccountID`, `SecurityLevel`, `RealmID`, `Comment`)
VALUES ((SELECT `id` FROM `account` WHERE `username` = 'SOAPWEBSITE'), 3, -1, 'Website SOAP delivery');
