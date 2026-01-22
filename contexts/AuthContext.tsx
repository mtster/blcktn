
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
  forceAdminMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_ID = '50529017-99f7-4797-9b27-3f363596dc2e';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const forceAdminMode = () => {
    console.log("⚠️ DEBUGGER: FORCING ADMIN MODE");
    if (user) {
      setProfile({
        id: user.id,
        company_name: "FORCED_ADMIN_SESSION",
        is_admin: true,
        status: 'active',
        created_at: new Date().toISOString()
      });
      setAuthError(null); // Clear any DB errors to allow UI to render
    } else {
      console.warn("Cannot force admin mode: No user session active.");
    }
  };

  const fetchProfile = async (userId: string) => {
    console.log(`DATABASE: Fetching profile for UID: ${userId}`);
    setAuthError(null); 
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`DATABASE ERROR: Code ${error.code} - ${error.message}`);
        
        // MASTER OVERRIDE FALLBACK
        if (userId === MASTER_ID) {
           console.warn("SYSTEM OVERRIDE: Master ID detected during fetch failure. Activating Emergency Fallback.");
           setProfile({
             id: userId,
             company_name: "SYSTEM OVERRIDE",
             is_admin: true,
             status: 'active',
             created_at: new Date().toISOString()
           });
           setAuthError(null); // Clear error so app loads
           return;
        }

        setAuthError(error.message);
        
        if (error.code === '42P17') {
           const msg = "CRITICAL: Infinite recursion detected in RLS policy. Please check Supabase Policies.";
           console.error(msg);
           setAuthError(msg);
        }
      } else {
        console.log("DATABASE: Profile loaded successfully:", data);
        setProfile(data as Profile);
      }
    } catch (err: any) {
      console.error('Profile fetch unexpected error:', err);
      // MASTER OVERRIDE FALLBACK (Catch Block)
      if (userId === MASTER_ID) {
           console.warn("SYSTEM OVERRIDE: Master ID detected during exception. Activating Emergency Fallback.");
           setProfile({
             id: userId,
             company_name: "SYSTEM OVERRIDE",
             is_admin: true,
             status: 'active',
             created_at: new Date().toISOString()
           });
           setAuthError(null);
           return;
      }
      setAuthError(err.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      isAdmin: profile?.is_admin || false,
      authError,
      signOut,
      forceAdminMode
    }}>
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
