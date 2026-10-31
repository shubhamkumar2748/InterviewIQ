import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewiq_local_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const nextUser = {
      uid: `local_${email.replace(/[^a-z0-9]/gi, '').toLowerCase()}`,
      email,
      displayName: email.split('@')[0],
    };
    setUser(nextUser);
    localStorage.setItem('interviewiq_local_user', JSON.stringify(nextUser));
    return nextUser;
  };

  const signup = async (email, password, displayName = '') => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const nextUser = {
      uid: `local_${email.replace(/[^a-z0-9]/gi, '').toLowerCase()}`,
      email,
      displayName: displayName || email.split('@')[0],
    };
    setUser(nextUser);
    localStorage.setItem('interviewiq_local_user', JSON.stringify(nextUser));
    return nextUser;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('interviewiq_local_user');
    return true;
  };

  const resetPassword = async (email) => {
    if (!email) {
      throw new Error('Email is required.');
    }
    return true;
  };

  const guestLogin = () => {
    const guest = {
      uid: 'guest_user',
      email: 'guest@interviewiq.ai',
      displayName: 'Alex Candidate (Demo)',
      isGuest: true,
    };
    setUser(guest);
    localStorage.setItem('interviewiq_local_user', JSON.stringify(guest));
    return guest;
  };

  const value = useMemo(
    () => ({
      user,
      loading: false,
      error: null,
      login,
      signup,
      logout,
      resetPassword,
      guestLogin,
      isFirebaseConfigured: false,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
