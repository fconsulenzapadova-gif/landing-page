import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SupabaseProfile {
  id: string;
  user_id: string;
  email: string | null;
  nickname: string | null;
  avatar_url: string | null;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export const useSupabaseProfile = () => {
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load profile from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const newProfile = {
            user_id: user.id,
            email: user.email,
            nickname: user.email?.split('@')[0] || 'Utente',
            full_name: user.email?.split('@')[0] || 'Utente',
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            toast({
              title: "Errore",
              description: "Impossibile creare il profilo",
              variant: "destructive",
            });
          } else {
            setProfile(createdProfile);
          }
        } else {
          console.error('Error loading profile:', error);
          toast({
            title: "Errore",
            description: "Impossibile caricare il profilo",
            variant: "destructive",
          });
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<SupabaseProfile>) => {
    if (!user || !profile) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare il profilo",
          variant: "destructive",
        });
        return false;
      }

      setProfile(data);
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo",
        variant: "destructive",
      });
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // First verify the current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (verifyError) {
        toast({
          title: "Errore",
          description: "Password attuale non corretta",
          variant: "destructive",
        });
        return false;
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        toast({
          title: "Errore",
          description: "Impossibile cambiare la password",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Password cambiata",
        description: "La password è stata aggiornata con successo",
      });
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Errore",
        description: "Impossibile cambiare la password",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    changePassword,
    reloadProfile: loadProfile,
  };
};