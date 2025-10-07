import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono richiesti');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSFixes() {
  console.log('🔧 Applicando le correzioni RLS al database...');

  const queries = [
    // Rimuovi le policy esistenti
    `DROP POLICY IF EXISTS "Allow public inserts on clients" ON clients;`,
    `DROP POLICY IF EXISTS "Allow public inserts on client_requests" ON client_requests;`,
    `DROP POLICY IF EXISTS "Allow authenticated users to read clients" ON clients;`,
    `DROP POLICY IF EXISTS "Allow authenticated users to read client_requests" ON client_requests;`,
    `DROP POLICY IF EXISTS "Allow authenticated users to update client_requests" ON client_requests;`,
    
    // Disabilita e riabilita RLS
    `ALTER TABLE clients DISABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE client_requests DISABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE clients ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;`,
    
    // Policy per inserimenti anonimi
    `CREATE POLICY "Enable insert for anonymous users" ON clients FOR INSERT TO anon WITH CHECK (true);`,
    `CREATE POLICY "Enable insert for anonymous users" ON client_requests FOR INSERT TO anon WITH CHECK (true);`,
    
    // Policy per inserimenti autenticati
    `CREATE POLICY "Enable insert for authenticated users" ON clients FOR INSERT TO authenticated WITH CHECK (true);`,
    `CREATE POLICY "Enable insert for authenticated users" ON client_requests FOR INSERT TO authenticated WITH CHECK (true);`,
    
    // Policy per lettura autenticata
    `CREATE POLICY "Enable read for authenticated users" ON clients FOR SELECT TO authenticated USING (true);`,
    `CREATE POLICY "Enable read for authenticated users" ON client_requests FOR SELECT TO authenticated USING (true);`,
    
    // Policy per aggiornamenti autenticati
    `CREATE POLICY "Enable update for authenticated users" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`,
    `CREATE POLICY "Enable update for authenticated users" ON client_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
  ];

  for (const query of queries) {
    try {
      console.log(`📝 Eseguendo: ${query.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      
      if (error) {
        console.error(`❌ Errore nell'esecuzione della query: ${error.message}`);
      } else {
        console.log('✅ Query eseguita con successo');
      }
    } catch (err) {
      console.error(`❌ Errore: ${err.message}`);
    }
  }

  console.log('🎉 Correzioni RLS applicate!');
}

// Esegui le correzioni
applyRLSFixes().catch(console.error);