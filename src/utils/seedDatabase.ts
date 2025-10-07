import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const sampleBuyers = [
  {
    name: 'Marco Rossi',
    email: 'marco.rossi@email.com',
    phone: '+39 333 123 4567',
    birthday: '1985-03-15',
    budget: '250.000 - 300.000',
    property_type: 'Appartamento',
    type: 'Prima casa',
    features: 'Arredamento: Non arredato, Spazi esterni: Balcone, Bagno: 2 bagni, Riscaldamento: Autonomo, Piano: 2°-4°',
    zona: 'Centro storico, Zona universitaria',
    notes: 'Cerca appartamento per giovane coppia, preferibilmente vicino ai mezzi pubblici'
  },
  {
    name: 'Anna Verdi',
    email: 'anna.verdi@email.com',
    phone: '+39 347 987 6543',
    birthday: '1978-11-22',
    budget: '180.000 - 220.000',
    property_type: 'Trilocale',
    type: 'Investimento',
    features: 'Arredamento: Indifferente, Spazi esterni: Terrazzo, Bagno: 1-2 bagni, Riscaldamento: Centralizzato, Piano: 1°-3°',
    zona: 'Periferia ben collegata',
    notes: 'Investitrice esperta, cerca immobile da mettere a reddito'
  }
];

const sampleSellers = [
  {
    name: 'Laura Neri',
    email: 'laura.neri@email.com',
    phone: '+39 335 111 2233',
    birthday: '1970-05-12',
    status: 'in gestione',
    notes: 'Cliente storico, molto collaborativo nelle trattative. Possiede appartamento in centro città completamente ristrutturato.'
  },
  {
    name: 'Giuseppe Blu',
    email: 'giuseppe.blu@email.com',
    phone: '+39 329 444 5566',
    birthday: '1955-09-30',
    status: 'da vendere',
    notes: 'Proprietario di villa in zona residenziale. Cerca vendita rapida per trasferimento.'
  }
];

export const seedDatabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Devi essere autenticato per aggiungere dati di esempio');
      return false;
    }

    // Check if data already exists
    const { data: existingBuyers } = await supabase
      .from('buyers')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    const { data: existingSellers } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existingBuyers && existingBuyers.length > 0) {
      toast.info('Dati di esempio già presenti per i buyers');
    } else {
      // Insert sample buyers
      const buyersToInsert = sampleBuyers.map(buyer => ({
        ...buyer,
        user_id: user.id
      }));

      const { error: buyersError } = await supabase
        .from('buyers')
        .insert(buyersToInsert);

      if (buyersError) {
        console.error('Error inserting buyers:', buyersError);
        toast.error('Errore nell\'inserimento dei buyers di esempio');
        return false;
      }
      toast.success('Buyers di esempio aggiunti con successo!');
    }

    if (existingSellers && existingSellers.length > 0) {
      toast.info('Dati di esempio già presenti per i sellers');
    } else {
      // Insert sample sellers
      const sellersToInsert = sampleSellers.map(seller => ({
        ...seller,
        user_id: user.id
      }));

      const { error: sellersError } = await supabase
        .from('sellers')
        .insert(sellersToInsert);

      if (sellersError) {
        console.error('Error inserting sellers:', sellersError);
        toast.error('Errore nell\'inserimento dei sellers di esempio');
        return false;
      }
      toast.success('Sellers di esempio aggiunti con successo!');
    }

    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error('Errore nell\'aggiunta dei dati di esempio');
    return false;
  }
};