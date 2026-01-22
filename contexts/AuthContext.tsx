
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
  
  // Calculate isAdmin based on multiple factors:
  // 1. Hardcoded Master ID
  // 2. Supabase Auth Metadata (raw_user_meta_data)
  // 3. Database Profile Table
  const isAdmin = 
    user?.id === MASTER_ID || 
    (user?.user_metadata?.is_admin === true) || 
    (profile?.is_admin === true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(`STEP 1 (Init): Session Found? ${!!session}`);
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
      console.log(`STEP 1 (Event): Auth State Changed. User ID: ${session?.user?.id}`);
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
      setAuthError(null); 
    } else {
      console.warn("Forcing admin mode on null session (Virtual Mode)");
      const virtualId = 'virtual-admin';
      setUser({ id: virtualId, user_metadata: { is_admin: true } } as User);
      setProfile({
        id: virtualId,
        company_name: "VIRTUAL_ADMIN",
        is_admin: true,
        status: 'active',
        created_at: new Date().toISOString()
      });
      setAuthError(null);
    }
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    console.log(`STEP 2: Checking for Master ID match...`);
    
    // HARDCORE OVERRIDE / METADATA CHECK
    // If we are master OR have metadata, we can basically consider ourselves "loaded" enough to start
    // even if the DB fetch fails later.
    if (userId === MASTER_ID) {
       console.log("STEP 2 RESULT: MATCHED. Engaging System Override.");
       
       // Set a provisional profile immediately
       setProfile({
         id: userId,
         company_name: "SYSTEM OVERRIDE",
         is_admin: true,
         status: 'active',
         created_at: new Date().toISOString()
       });
       
       // Attempt DB fetch in background, but don't block loading
       setLoading(false);
       
       // We still try to fetch to get real company name if possible, but catch errors silently
       try {
          const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
          if (data) setProfile(data as Profile);
          if (error) console.warn("Background DB fetch failed (ignored due to Override):", error.message);
       } catch (e) {
          console.warn("Background DB fetch exception (ignored):", e);
       }
       return;
    }

    console.log("STEP 2 RESULT: NO MATCH. Proceeding to DB fetch.");
    console.log(`STEP 3: Profile fetch initiated for ${userId}...`);
    setAuthError(null); 
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`STEP 4: Profile fetch result: ERROR - ${error.message}`);
        setAuthError(error.message);
        
        if (error.code === '42P17') {
           const msg = "CRITICAL: Infinite recursion detected in RLS policy. Please check Supabase Policies.";
           console.error(msg);
           setAuthError(msg);
        }
      } else {
        console.log("STEP 4: Profile fetch result: SUCCESS", data);
        setProfile(data as Profile);
      }
    } catch (err: any) {
      console.error('STEP 4: Profile fetch result: EXCEPTION', err);
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
      isAdmin, // Now uses the robust derived check
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
