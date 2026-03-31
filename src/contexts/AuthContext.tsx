
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from '@/types';
import { clearAuthCookies } from '@/lib/auth-cookies';

/**
 * @fileOverview Baalvion Mock Auth Context
 * 
 * COMPLETELY DECOUPLED FROM FIREBASE AUTH to bypass API key errors.
 * Provides a permanent Admin session by default.
 */

const MOCK_ADMIN_PROFILE: User = {
  id: 'admin_root',
  email: 'admin@baalvion.com',
  role: 'ADMIN',
  displayName: 'Root Administrator',
  status: 'ACTIVE',
  isVerified: true,
  tourCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface AuthState {
  currentUser: any;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_PROFILE'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  currentUser: { uid: 'mock_admin_uid', email: 'admin@baalvion.com', emailVerified: true },
  userProfile: MOCK_ADMIN_PROFILE,
  loading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state] = useReducer(authReducer, initialState);

  const signOutAction = async () => {
    clearAuthCookies();
    window.location.href = '/auth/login';
  };

  const refreshUser = async () => {
    // No-op in mock mode
  };

  return (
    <AuthContext.Provider value={{ ...state, signOut: signOutAction, refreshUser }}>
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
