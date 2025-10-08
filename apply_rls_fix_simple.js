import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Errore: VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY sono richiesti');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔧 Testando la connessione al database...');
  
  try {
    // Prova a fare una query semplice per testare la connessione
    const { error } = await supabase
      .from('clients')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('📊 Informazioni sull\'errore:', error);
      
      if (error.code === '42501') {
        console.log('✅ La tabella clients esiste ma le policy RLS stanno bloccando l\'accesso');
        console.log('🔧 Questo conferma che dobbiamo applicare le correzioni RLS');
        return true;
      } else if (error.code === '42P01') {
        console.log('❌ La tabella clients non esiste nel database');
        return false;
      }
    } else {
      console.log('✅ Connessione riuscita, tabella clients accessibile');
      return true;
    }
  } catch (err) {
    console.error('❌ Errore di connessione:', err.message);
    return false;
  }
}

async function testInsert() {
  console.log('🧪 Testando inserimento nella tabella clients...');
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: 'Test Client',
        email: 'test@example.com',
        phone: '1234567890'
      })
      .select();
    
    if (error) {
      console.log('❌ Errore nell\'inserimento:', error.message);
      console.log('📊 Codice errore:', error.code);
      return false;
    } else {
      console.log('✅ Inserimento riuscito:', data);
      
      // Rimuovi il record di test
      await supabase
        .from('clients')
        .delete()
        .eq('email', 'test@example.com');
      
      return true;
    }
  } catch (err) {
    console.error('❌ Errore:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Avvio diagnostica database...');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('❌ Problema di connessione al database');
    return;
  }
  
  const insertOk = await testInsert();
  if (!insertOk) {
    console.log('❌ Le policy RLS stanno bloccando gli inserimenti');
    console.log('📝 È necessario applicare le correzioni RLS manualmente nel dashboard Supabase');
    console.log('🔗 Vai su: https://supabase.com/dashboard/project/rfldpzucwwfgnbrzjlym/sql');
    console.log('📋 Copia e incolla il contenuto del file fix_rls_policies.sql');
  } else {
    console.log('✅ Il database funziona correttamente!');
  }
}

main().catch(console.error);