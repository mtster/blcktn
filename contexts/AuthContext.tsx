
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isProfileCreating: boolean;
  isAdmin: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileCreating, setIsProfileCreating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Dynamic Admin Check:
  // 1. Check Supabase Auth Metadata (fastest, set during login/signup/admin update)
  // 2. Check Database Profile (fallback source of truth)
  const isAdmin = 
    (user?.user_metadata?.is_admin === true) || 
    (profile?.is_admin === true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        if (session.user.user_metadata?.is_admin) {
           console.log("[AUTH] Master Session Initiated via Metadata.");
        }
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

  const fetchProfile = async (userId: string) => {
    setAuthError(null); 
    setIsProfileCreating(false);
    
    try {
      // Use maybeSingle() instead of single() to handle cases where the trigger hasn't finished yet
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log("[AUTH] Profile result: " + JSON.stringify(data));

      if (error) {
        console.error(`[DATABASE] Profile fetch error: ${error.message}`);
        setAuthError(error.message);
      } else if (!data) {
        // No profile found, but no error. Likely the DB trigger is still running.
        console.log("[AUTH] Profile not found yet, trigger likely processing...");
        setIsProfileCreating(true);
        setProfile(null);
      } else {
        console.log("[DATABASE] Profile fetched successfully.");
        setProfile(data as Profile);
      }
    } catch (err: any) {
      console.error('[DATABASE] Unexpected error:', err);
      setAuthError(err.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setAuthError(null);
    setIsProfileCreating(false);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      isProfileCreating,
      isAdmin, 
      authError,
      signOut
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
