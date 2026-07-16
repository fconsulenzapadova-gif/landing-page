CREATE TABLE IF NOT EXISTS lead_submissions (
  id TEXT PRIMARY KEY,
  request_type TEXT NOT NULL CHECK (request_type IN ('acquisto', 'vendita', 'locazione')),
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  budget TEXT,
  timeframe TEXT,
  features TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  contact_preference TEXT NOT NULL CHECK (contact_preference IN ('telefono', 'email', 'whatsapp')),
  notes TEXT,
  source_url TEXT,
  referrer TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_lead_submissions_status_created_at
  ON lead_submissions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_submissions_request_type_created_at
  ON lead_submissions(request_type, created_at DESC);
