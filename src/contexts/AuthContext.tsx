'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { clearAuthCookies, setAuthCookies } from '@/lib/auth-cookies';

/**
 * @fileOverview Baalvion Mock Auth Context
 * 
 * Provides a dynamic mock session that allows switching roles for testing.
 */

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signInAs: (role: UserRole) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from session storage or default
  useEffect(() => {
    const savedRole = typeof window !== 'undefined' ? localStorage.getItem('mock_role') as UserRole : null;
    if (savedRole) {
      setRole(savedRole);
      setCurrentUser(getMockProfile(savedRole));
    }
    setLoading(false);
  }, []);

  const getMockProfile = (role: UserRole): User => ({
    id: role === 'ADMIN' ? 'admin_root' : role === 'BRAND' ? 'brand_user_1' : 'creator_user_1',
    email: `${role.toLowerCase()}@baalvion.com`,
    role: role,
    displayName: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
    status: 'ACTIVE',
    isVerified: true,
    tourCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const signInAs = (newRole: UserRole) => {
    setRole(newRole);
    const profile = getMockProfile(newRole);
    setCurrentUser(profile);
    localStorage.setItem('mock_role', newRole);
    setAuthCookies({ role: newRole, onboarded: true });
  };

  const signOutAction = async () => {
    clearAuthCookies();
    localStorage.removeItem('mock_role');
    setCurrentUser(null);
    setRole(null);
    window.location.href = '/auth/login';
  };

  const refreshUser = async () => {};

  return (
    <AuthContext.Provider value={{ currentUser, loading, error: null, signInAs, signOut: signOutAction, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
