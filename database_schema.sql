-- Schema pubblico per il form lead Gemut Capital
-- Obiettivo: consentire invii anonimi senza SELECT/UPDATE pubblici.

CREATE TABLE IF NOT EXISTS lead_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,

    request_type TEXT NOT NULL CHECK (request_type IN ('acquisto', 'vendita', 'locazione')),
    property_type TEXT,
    location TEXT NOT NULL,
    budget TEXT,
    timeframe TEXT,
    features TEXT,
    notes TEXT,

    source TEXT NOT NULL DEFAULT 'gemutcapital.com',
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed', 'archived')),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_submissions_email ON lead_submissions(email);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_request_type ON lead_submissions(request_type);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_status ON lead_submissions(status);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_created_at ON lead_submissions(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lead_submissions_updated_at ON lead_submissions;

CREATE TRIGGER update_lead_submissions_updated_at
    BEFORE UPDATE ON lead_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous lead insert" ON lead_submissions;
DROP POLICY IF EXISTS "Allow authenticated lead insert" ON lead_submissions;
DROP POLICY IF EXISTS "Allow authenticated lead read" ON lead_submissions;
DROP POLICY IF EXISTS "Allow authenticated lead update" ON lead_submissions;

CREATE POLICY "Allow anonymous lead insert" ON lead_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated lead insert" ON lead_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated lead read" ON lead_submissions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated lead update" ON lead_submissions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
