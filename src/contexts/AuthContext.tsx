import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import Cookie from "js-cookie";

export interface QueueTicket {
  id: string;
  ticket_number: number;
  department: string;
  status: number;
  priority: number;
  estimated_time: string;
  profiles: Profile;
  isReady: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  isAdmin: boolean;
}


interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loggedIn: () => Promise<boolean>
  signIn: (email: string, password: string, totpToken: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId?: string) => Promise<Profile[] | null>;
  fetchTickets: (userId?: string) => Promise<(QueueTicket & {createdAt: string})[] | null>;
  createTicket: (userId: string, priority: number, department: string) => Promise<QueueTicket | null>;
  updateTicket: (ticket: QueueTicket) => Promise<boolean>;
  deleteTicket: (ticketId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id).then((v) => {
        if (v) {
          setProfile(v[0])
        }
      })
    } else {
      setProfile(null)
    }
  }, [user])

  const loggedIn = async () => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) {
      return false
    }
    
    if (data.nextLevel !== data.currentLevel) 
      return false
    return true

  }

  const signIn = async (email: string, password: string, totpToken: string) => {
    const { error, data: { user } } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const factors = await supabase.auth.mfa.listFactors()
    if (factors.error) {
      throw factors.error
    }

    const totpFactor = factors.data.totp[0]

    if (!totpFactor) {
      throw new Error('No TOTP factors found!')
    }

    const factorId = totpFactor.id

    const challenge = await supabase.auth.mfa.challenge({ factorId })
    if (challenge.error) {
      throw challenge.error
    }

    const challengeId = challenge.data.id

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: totpToken,
    })
    if (verify.error) {
      throw verify.error
    }

  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    const { error: signUpError, data } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            full_name: fullName,
            phone_number: phoneNumber
          }])
          .select()
          .single();

        if (profileError) throw profileError;
      } catch (error) {
        // If profile creation fails, clean up by deleting the auth user
        await supabase.auth.admin.deleteUser(data.user.id);
        throw error;
      }
    }
  };

  const fetchProfile = async (userId?: string) => {
    try {
      if (userId) {
        var { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
      } else {
        var { data, error } = await supabase
          .from('profiles')
          .select('*')
      }
      if (error) throw error;
      return data
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null
  };

  const fetchTickets = async (userId?: string) => {
    try {
      var query = supabase
        .from('queue_tickets')
        .select('*, profiles(*)')
      if (userId)
        query = query.eq('patient_id', userId)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error;
      return data
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
    return null
  };

  const updateTicket = async (ticket: QueueTicket) => {
    try {
      const { profiles, id, ...ticketData } = ticket
      console.log(ticketData)
      var { error } = await supabase
        .from('queue_tickets')
        .update(ticketData)
        .eq("id", id)

      if (error) throw error;
      return true
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
    return false
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const createTicket = async (userId: string, priority: number, department: string) => {
    try {
      const { data, error } = await supabase
        .from('queue_tickets')
        .insert([
          {
            patient_id: userId,
            department,
            priority,
            estimated_time: new Date(Date.now() + 30 * 60000).toISOString(),
          },
        ])
        .select()
        .maybeSingle()

      if (error) throw error;
      return data
    } catch (error: any) {
      console.error('Error updating ticket:', error);
    }
    return null
  };

  const deleteTicket = async (ticketId: string) => {
    console.log(ticketId)
    try {
      const { error } = await supabase
        .from('queue_tickets')
        .delete()
        .eq("id", ticketId)

      if (error) throw error;
      return true
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loggedIn, signIn, signUp, signOut, fetchProfile, fetchTickets, createTicket, updateTicket, deleteTicket }}>
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