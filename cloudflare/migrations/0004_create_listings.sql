CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  contract_type TEXT NOT NULL CHECK (contract_type IN ('vendita', 'locazione')),
  title TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT '',
  municipality TEXT NOT NULL DEFAULT '',
  zone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  postal_code TEXT NOT NULL DEFAULT '',
  price_cents INTEGER,
  price_label TEXT,
  surface_sqm INTEGER,
  rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor TEXT NOT NULL DEFAULT '',
  elevator TEXT NOT NULL DEFAULT '',
  condition TEXT NOT NULL DEFAULT '',
  energy_class TEXT NOT NULL DEFAULT '',
  available_from TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  features TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(features)),
  highlights TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(highlights)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listing_images (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL UNIQUE,
  alt_text TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_public_catalog
  ON listings(status, sort_order, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_position
  ON listing_images(listing_id, position);
