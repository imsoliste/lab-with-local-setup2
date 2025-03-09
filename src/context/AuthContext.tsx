import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
          setIsAdmin(profile.role === 'admin');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
          setIsAdmin(profile.role === 'admin');
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      if (data.user) {
        // Check if user exists in users table
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('id', data.user.id)
          .single();

        if (!existingUser) {
          // Create new user profile
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                phone,
                role: 'user'
              }
            ])
            .select()
            .single();

          if (createError) throw createError;
          setUser(newUser);
        } else {
          setUser(existingUser);
          setIsAdmin(existingUser.role === 'admin');
        }
      }

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, message: 'Failed to verify OTP' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      sendOtp, 
      verifyOtp, 
      logout, 
      updateUserProfile,
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};