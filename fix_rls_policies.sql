-- Fix RLS policies per permettere inserimenti pubblici nelle tabelle clients e client_requests

-- Prima rimuovi le policy esistenti se ci sono
DROP POLICY IF EXISTS "Allow public inserts on clients" ON clients;
DROP POLICY IF EXISTS "Allow public inserts on client_requests" ON client_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to read client_requests" ON client_requests;
DROP POLICY IF EXISTS "Allow authenticated users to update client_requests" ON client_requests;

-- Disabilita temporaneamente RLS per configurare le policy
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests DISABLE ROW LEVEL SECURITY;

-- Riabilita RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;

-- Policy per permettere inserimenti pubblici (senza autenticazione)
CREATE POLICY "Enable insert for anonymous users" ON clients
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON client_requests
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Policy per permettere inserimenti anche agli utenti autenticati
CREATE POLICY "Enable insert for authenticated users" ON clients
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users" ON client_requests
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Policy per permettere lettura agli utenti autenticati
CREATE POLICY "Enable read for authenticated users" ON clients
    FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "Enable read for authenticated users" ON client_requests
    FOR SELECT 
    TO authenticated
    USING (true);

-- Policy per permettere aggiornamenti agli utenti autenticati
CREATE POLICY "Enable update for authenticated users" ON clients
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON client_requests
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);