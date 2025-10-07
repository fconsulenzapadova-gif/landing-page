import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BuyerClient, SellerClient } from '@/components/Dashboard';
import { toast } from 'sonner';

export const useSupabaseClients = () => {
  const [buyers, setBuyers] = useState<BuyerClient[]>([]);
  const [sellers, setSellers] = useState<SellerClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save buyer to Supabase
  const saveBuyer = async (buyer: Omit<BuyerClient, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('buyers')
        .insert({
          name: buyer.name,
          email: buyer.email,
          phone: buyer.phone,
          birthday: buyer.birthday,
          budget: buyer.budget,
          property_type: buyer.propertyType,
          type: buyer.type,
          features: buyer.features,
          zona: buyer.zona,
          notes: buyer.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving buyer:', error);
        throw error;
      }

      toast.success('Cliente acquirente salvato con successo!');
      return data;
    } catch (error) {
      console.error('Error saving buyer:', error);
      toast.error('Errore nel salvare il cliente acquirente');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Save seller to Supabase
  const saveSeller = async (seller: Omit<SellerClient, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('sellers')
        .insert({
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          birthday: seller.birthday,
          status: seller.status,
          notes: seller.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving seller:', error);
        throw error;
      }

      toast.success('Cliente venditore salvato con successo!');
      return data;
    } catch (error) {
      console.error('Error saving seller:', error);
      toast.error('Errore nel salvare il cliente venditore');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update buyer in Supabase
  const updateBuyer = async (id: string, buyer: Partial<BuyerClient>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('buyers')
        .update({
          name: buyer.name,
          email: buyer.email,
          phone: buyer.phone,
          birthday: buyer.birthday,
          budget: buyer.budget,
          property_type: buyer.propertyType,
          type: buyer.type,
          features: buyer.features,
          zona: buyer.zona,
          notes: buyer.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating buyer:', error);
        throw error;
      }

      toast.success('Cliente acquirente aggiornato con successo!');
      return data;
    } catch (error) {
      console.error('Error updating buyer:', error);
      toast.error('Errore nell\'aggiornare il cliente acquirente');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update seller in Supabase
  const updateSeller = async (id: string, seller: Partial<SellerClient>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sellers')
        .update({
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          birthday: seller.birthday,
          status: seller.status,
          notes: seller.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating seller:', error);
        throw error;
      }

      toast.success('Cliente venditore aggiornato con successo!');
      return data;
    } catch (error) {
      console.error('Error updating seller:', error);
      toast.error('Errore nell\'aggiornare il cliente venditore');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete buyer from Supabase
  const deleteBuyer = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('buyers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting buyer:', error);
        throw error;
      }

      toast.success('Cliente acquirente eliminato con successo!');
    } catch (error) {
      console.error('Error deleting buyer:', error);
      toast.error('Errore nell\'eliminare il cliente acquirente');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete seller from Supabase
  const deleteSeller = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting seller:', error);
        throw error;
      }

      toast.success('Cliente venditore eliminato con successo!');
    } catch (error) {
      console.error('Error deleting seller:', error);
      toast.error('Errore nell\'eliminare il cliente venditore');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load buyers from Supabase
  const loadBuyers = async (): Promise<BuyerClient[]> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading buyers:', error);
        throw error;
      }

      // Transform Supabase data to client format
      return data.map(buyer => ({
        id: buyer.id,
        name: buyer.name,
        email: buyer.email || '',
        phone: buyer.phone || '',
        birthday: buyer.birthday || '',
        budget: buyer.budget,
        propertyType: buyer.property_type,
        type: buyer.type as 'Locazione' | 'Acquisto',
        features: buyer.features,
        zona: buyer.zona || '',
        notes: buyer.notes || '',
        createdAt: new Date(buyer.created_at)
      }));
    } catch (error) {
      console.error('Error loading buyers:', error);
      toast.error('Errore nel caricare i clienti acquirenti');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load sellers from Supabase
  const loadSellers = async (): Promise<SellerClient[]> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading sellers:', error);
        throw error;
      }

      // Transform Supabase data to client format
      return data.map(seller => ({
        id: seller.id,
        name: seller.name,
        email: seller.email || '',
        phone: seller.phone || '',
        birthday: seller.birthday || '',
        status: seller.status as SellerClient['status'],
        notes: seller.notes || '',
        properties: [], // Properties will be loaded separately
        createdAt: new Date(seller.created_at)
      }));
    } catch (error) {
      console.error('Error loading sellers:', error);
      toast.error('Errore nel caricare i clienti venditori');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load buyers and sellers on mount
  useEffect(() => {
    const loadData = async () => {
      const buyersData = await loadBuyers();
      const sellersData = await loadSellers();
      setBuyers(buyersData);
      setSellers(sellersData);
    };
    loadData();
  }, []);

  const refreshBuyers = async () => {
    const data = await loadBuyers();
    setBuyers(data);
  };

  const refreshSellers = async () => {
    const data = await loadSellers();
    setSellers(data);
  };

  return {
    buyers,
    sellers,
    loading: isLoading,
    saveBuyer,
    updateBuyer,
    deleteBuyer,
    loadBuyers: refreshBuyers,
    saveSeller,
    updateSeller,
    deleteSeller,
    loadSellers: refreshSellers,
  };
};