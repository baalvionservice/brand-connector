'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { onIdTokenChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDocument } from '@/lib/firestore';
import { User } from '@/types';

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
  currentUser: null,
  userProfile: null,
  loading: true,
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

  const fetchProfile = async (uid: string) => {
    try {
      const profile = await getDocument<User>('users', uid);
      dispatch({ type: 'SET_PROFILE', payload: profile });
    } catch (err) {
      console.error("Error fetching profile:", err);
      dispatch({ type: 'SET_PROFILE', payload: null });
    }
  };

  useEffect(() => {
    // onIdTokenChanged is better for tracking verification status changes
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      dispatch({ type: 'SET_USER', payload: user });
      if (user) {
        await fetchProfile(user.uid);
      } else {
        dispatch({ type: 'SET_PROFILE', payload: null });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return unsubscribe;
  }, []);

  const signOutAction = async () => {
    await firebaseSignOut(auth);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
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
