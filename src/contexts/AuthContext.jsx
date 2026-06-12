import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (supabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        console.warn('Profile fetch warning:', error);
        const meta = supabaseUser.user_metadata || {};
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: meta.role || 'jobseeker',
          name: meta.name || supabaseUser.email.split('@')[0],
          company: meta.role === 'employer' ? meta.organisationName : null,
          ...meta
        });
      } else if (profile) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: profile.role,
          name: profile.name,
          company: profile.organisation_name || null,
          fatherName: profile.father_name,
          motherName: profile.mother_name,
          dob: profile.dob,
          mobile: profile.mobile,
          currentAddress: profile.current_address,
          permanentAddress: profile.permanent_address,
          pinCode: profile.pin_code,
          district: profile.district,
          state: profile.state,
          qualification: profile.qualification,
          organisationName: profile.organisation_name,
          address: profile.address,
          idType: profile.id_type,
          idNumber: profile.id_number,
          plan: profile.role === 'employer' ? 'Pro Enterprise' : 'Free',
          profileCompletion: profile.role === 'employer' ? 45 : 35
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    // Check initial active session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error('Session retrieval failed:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user found');

      // Fetch profile to return context updates immediately for redirects
      let role = data.user.user_metadata?.role || 'jobseeker';
      let name = data.user.user_metadata?.name || data.user.email;
      let company = role === 'employer' ? data.user.user_metadata?.organisationName : null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        role = profile.role;
        name = profile.name;
        company = profile.organisation_name || null;
      }

      const userData = {
        id: data.user.id,
        name,
        email: data.user.email,
        role,
        company,
        plan: role === 'employer' ? 'Pro Enterprise' : 'Free',
        profileCompletion: role === 'employer' ? 45 : 35
      };

      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role, extraFields = {}) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name,
            role,
            ...extraFields
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('SignUp failed');

      const userData = {
        id: data.user.id,
        name,
        email: data.user.email,
        role,
        company: role === 'employer' ? (extraFields.organisationName || 'Your Company') : null,
        plan: 'Free',
        profileCompletion: role === 'employer' ? 40 : 35,
        ...extraFields,
      };

      return userData;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
