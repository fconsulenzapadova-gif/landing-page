ALTER TABLE lead_submissions ADD COLUMN request_role TEXT CHECK (request_role IN ('cerca', 'proprietario'));
ALTER TABLE lead_submissions ADD COLUMN location_mode TEXT CHECK (location_mode IN ('text', 'polygon'));
ALTER TABLE lead_submissions ADD COLUMN location_geometry TEXT;
