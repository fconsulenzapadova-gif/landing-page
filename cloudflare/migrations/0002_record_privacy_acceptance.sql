ALTER TABLE lead_submissions
  ADD COLUMN privacy_policy_version TEXT NOT NULL DEFAULT '2026-07-16';

ALTER TABLE lead_submissions
  ADD COLUMN privacy_accepted_at TEXT;

UPDATE lead_submissions
SET privacy_accepted_at = created_at
WHERE privacy_accepted_at IS NULL;
