import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isDemoAuth } from '@/config/demo';

export interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  city: string | null;
  pin_code: string | null;
  address: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  phone: string | null; // Primary user phone identity
  sendOtp: (phone: string, name?: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching profile:', error);
      }
      return null;
    }
    return data as UserProfile | null;
  };

  // DEMO AUTH: Create a mock user object for demo mode
  const createDemoUser = (phone: string): User => {
    const sanitizedPhone = phone.replace(/\D/g, '');
    return {
      id: sanitizedPhone, // Use phone as ID in demo mode
      aud: 'authenticated',
      role: 'authenticated',
      email: `${sanitizedPhone}@smartbasket.app`,
      email_confirmed_at: new Date().toISOString(),
      phone: phone,
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'demo',
        providers: ['demo'],
      },
      user_metadata: {
        phone: phone,
        name: 'Demo User',
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_anonymous: false,
    } as User;
  };

  // DEMO AUTH: Create a mock session for demo mode
  const createDemoSession = (user: User): Session => {
    return {
      provider_token: 'demo_token',
      provider_refresh_token: null,
      access_token: 'demo_access_token',
      refresh_token: 'demo_refresh_token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      session_state: 'demo',
      user: user,
    } as Session;
  };

  // DEMO AUTH: Create a mock profile for demo mode
  const createDemoProfile = (phone: string): UserProfile => {
    const sanitizedPhone = phone.replace(/\D/g, '');
    return {
      id: sanitizedPhone,
      name: 'Demo User',
      phone: phone,
      city: null,
      pin_code: null,
      address: null,
    };
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Extract phone from user metadata and set it
        const userPhone = session?.user?.user_metadata?.phone || null;
        setPhone(userPhone);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then((profileData) => {
              setProfile(profileData);
              // Also set phone from profile if available
              if (profileData?.phone) {
                setPhone(profileData.phone);
              }
            });
          }, 0);
        } else {
          setProfile(null);
          setPhone(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Extract phone from user metadata
      const userPhone = session?.user?.user_metadata?.phone || null;
      setPhone(userPhone);
      
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          setProfile(profileData);
          // Also set phone from profile if available
          if (profileData?.phone) {
            setPhone(profileData.phone);
          }
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOtp = async (phone: string, name?: string) => {
    // DEMO AUTH: In demo mode, accept any phone number without calling Supabase
    if (isDemoAuth()) {
      if (import.meta.env.DEV) {
        console.log(`[DEMO AUTH] OTP requested for phone: ${phone}`);
      }
      return { error: null };
    }

    // Production: Generate email internally for Supabase OTP
    // Keep this internal only - never display to user
    const email = `${phone.replace(/\D/g, '')}@smartbasket.app`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
        data: { phone, ...(name && { name }) },
      },
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  const verifyOtp = async (phone: string, token: string) => {
    // DEMO AUTH: In demo mode, accept any 6-digit code and create mock session
    if (isDemoAuth()) {
      // Validate token is 6 digits
      if (!/^\d{6}$/.test(token)) {
        return { error: new Error('Invalid OTP format. Must be 6 digits.') };
      }

      if (import.meta.env.DEV) {
        console.log(`[DEMO AUTH] OTP verified for phone: ${phone}`);
      }

      // Create mock user, session, and profile
      const demoUser = createDemoUser(phone);
      const demoSession = createDemoSession(demoUser);
      const demoProfile = createDemoProfile(phone);

      // Set state to simulate authenticated session
      setUser(demoUser);
      setSession(demoSession);
      setProfile(demoProfile);
      setPhone(phone);

      if (import.meta.env.DEV) {
        console.log('[DEMO AUTH] Mock session created:', { user: demoUser, profile: demoProfile });
      }

      return { error: null };
    }

    // Production: Generate email internally for Supabase OTP verification
    // Keep this internal only - never display to user
    const email = `${phone.replace(/\D/g, '')}@smartbasket.app`;
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { error };
    }

    // Update profile with phone if it's a new user or missing
    if (data.user) {
      const existingProfile = await fetchProfile(data.user.id);
      if (!existingProfile || !existingProfile.phone) {
        await supabase
          .from('profiles')
          .update({ phone })
          .eq('id', data.user.id);
      }
      // Set phone state
      setPhone(phone);
    }

    return { error: null };
  };

  const signOut = async () => {
    // DEMO AUTH: In demo mode, just clear state (no Supabase call needed)
    if (isDemoAuth()) {
      if (import.meta.env.DEV) {
        console.log('[DEMO AUTH] Logging out from demo session');
      }
      setUser(null);
      setSession(null);
      setProfile(null);
      setPhone(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      return;
    }

    // Production: Call Supabase signOut
    await supabase.auth.signOut();
    setProfile(null);
    setPhone(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    // DEMO MODE – backend persistence disabled
    if (isDemoAuth()) {
      if (import.meta.env.DEV) {
        console.log('[DEMO AUTH] Updating profile locally (no Supabase call):', data);
      }
      // Update profile data locally in React state only
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      if (import.meta.env.DEV) {
        console.log('[DEMO AUTH] Profile updated successfully in demo mode');
      }
      
      return { error: null };
    }

    // Production mode: Call Supabase to persist profile
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...data } : null);
    }

    return { error };
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        phone,
        loading,
        sendOtp,
        verifyOtp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
