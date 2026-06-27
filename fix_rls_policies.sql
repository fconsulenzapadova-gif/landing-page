-- RLS policies per il form lead pubblico Gemut Capital.
-- Il sito inserisce solo in lead_submissions e non deve leggere dati anonimi.

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
