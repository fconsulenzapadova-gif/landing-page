import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getAppStorage } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storage = getAppStorage();
    
    // Check for stored auth token first (for cross-domain scenarios)
    const storedToken = storage.getItem('supabase.auth.token');
    if (storedToken) {
      try {
        const session = JSON.parse(storedToken);
        if (session && session.access_token) {
          supabase.auth.setSession(session);
        }
      } catch (error) {
        console.error('Error parsing stored auth token:', error);
        storage.removeItem('supabase.auth.token');
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Store session in localStorage for cross-domain access
        if (session) {
          console.log('💾 Storing session in localStorage');
          storage.setItem('supabase.auth.token', JSON.stringify(session));
        } else {
          console.log('🗑️ Removing session from localStorage');
          storage.removeItem('supabase.auth.token');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    logout
  };

  console.log('🔍 AuthContext value:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    isAuthenticated: !!user,
    loading 
  });

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};