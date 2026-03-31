
'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { onIdTokenChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDocument, queryDocuments } from '@/lib/firestore';
import { User, CreatorProfile, BrandProfile, OnboardingStatus } from '@/types';
import { setAuthCookies, clearAuthCookies } from '@/lib/auth-cookies';
import { where, limit } from 'firebase/firestore';

// MOCK ADMIN USER FOR UNRESTRICTED ACCESS
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
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: FirebaseUser | null }
  | { type: 'SET_PROFILE'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  currentUser: { uid: 'mock_uid', email: 'admin@baalvion.com' } as any, // Mocked Auth User
  userProfile: MOCK_ADMIN_PROFILE, // Default to Admin for access
  loading: false, // Start directly
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
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Sync logic disabled for mock mode
  const syncCookies = async (user: FirebaseUser | null, profile: User | null) => {};

  useEffect(() => {
    // In mock mode, we don't listen to actual Firebase Auth changes to prevent errors
    // If you want to use real auth again, uncomment the standard implementation
  }, []);

  const signOutAction = async () => {
    clearAuthCookies();
    // Redirect to home in mock mode
    window.location.href = '/';
  };

  const refreshUser = async () => {};

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
