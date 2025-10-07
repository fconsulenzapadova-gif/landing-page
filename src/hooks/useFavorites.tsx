import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Favorite {
  id: string;
  client_id: string;
  client_type: 'buyer' | 'seller';
  user_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('client_favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading favorites:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i preferiti",
          variant: "destructive",
        });
      } else {
        setFavorites((data || []) as Favorite[]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (clientId: string, clientType: 'buyer' | 'seller') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per gestire i preferiti",
          variant: "destructive",
        });
        return;
      }

      const existingFavorite = favorites.find(
        f => f.client_id === clientId && f.user_id === user.id
      );

      if (existingFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('client_favorites')
          .delete()
          .eq('client_id', clientId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing favorite:', error);
          toast({
            title: "Errore",
            description: "Impossibile rimuovere dai preferiti",
            variant: "destructive",
          });
        } else {
          setFavorites(prev => prev.filter(f => f.id !== existingFavorite.id));
          toast({
            title: "Rimosso dai preferiti",
            description: "Cliente rimosso dai preferiti",
          });
        }
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('client_favorites')
          .insert({
            client_id: clientId,
            client_type: clientType,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding favorite:', error);
          toast({
            title: "Errore",
            description: "Impossibile aggiungere ai preferiti",
            variant: "destructive",
          });
        } else {
          setFavorites(prev => [...prev, data as Favorite]);
          toast({
            title: "Aggiunto ai preferiti",
            description: "Cliente aggiunto ai preferiti",
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'operazione",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (clientId: string) => {
    return favorites.some(f => f.client_id === clientId);
  };

  const getFavoritesByType = (clientType: 'buyer' | 'seller') => {
    return favorites.filter(f => f.client_type === clientType);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    loadFavorites,
  };
};