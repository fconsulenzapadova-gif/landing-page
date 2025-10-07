-- Schema per gestire clienti e richieste
-- Questo file contiene le definizioni SQL per le nuove tabelle

-- Tabella per i dati personali dei clienti
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indici per performance
    CONSTRAINT unique_client_email UNIQUE(email)
);

-- Tabella per le richieste dei clienti
CREATE TABLE IF NOT EXISTS client_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Tipo di richiesta
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('acquisto', 'vendita', 'locazione')),
    
    -- Dettagli della richiesta
    property_type VARCHAR(100),
    location VARCHAR(255),
    budget VARCHAR(100),
    timeframe VARCHAR(100),
    features TEXT,
    notes TEXT,
    
    -- Metadati
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    processed_by UUID REFERENCES auth.users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_client_requests_client_id ON client_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_client_requests_type ON client_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_client_requests_status ON client_requests(status);
CREATE INDEX IF NOT EXISTS idx_client_requests_created_at ON client_requests(created_at);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_requests_updated_at 
    BEFORE UPDATE ON client_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
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