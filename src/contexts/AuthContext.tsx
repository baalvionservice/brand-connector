
'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { onIdTokenChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDocument, queryDocuments } from '@/lib/firestore';
import { User, CreatorProfile, BrandProfile, OnboardingStatus } from '@/types';
import { setAuthCookies, clearAuthCookies } from '@/lib/auth-cookies';
import { where, limit } from 'firebase/firestore';

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

  const syncCookies = async (user: FirebaseUser | null, profile: User | null) => {
    if (user && profile) {
      // Check onboarding status from the secondary profile
      let isOnboarded = false;
      try {
        if (profile.role === 'CREATOR') {
          const creator = await getDocument<CreatorProfile>('creators', `creator_${user.uid}`);
          isOnboarded = creator?.onboardingStatus === OnboardingStatus.COMPLETED;
        } else if (profile.role === 'BRAND') {
          const brand = await getDocument<BrandProfile>('brands', `brand_${user.uid}`);
          isOnboarded = brand?.onboardingStatus === OnboardingStatus.COMPLETED;
        } else if (profile.role === 'ADMIN') {
          isOnboarded = true; // Admins are always onboarded
        }
      } catch (e) {
        console.error("Cookie sync onboarding check failed", e);
      }

      setAuthCookies({
        session: user.uid,
        role: profile.role,
        verified: user.emailVerified,
        onboarded: isOnboarded
      });
    } else if (!user) {
      clearAuthCookies();
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      dispatch({ type: 'SET_USER', payload: user });
      
      if (user) {
        try {
          // Attempt to fetch profile by UID
          let profile = await getDocument<User>('users', user.uid);
          
          // If not found (seeded user who just signed up), attempt to find by email
          if (!profile && user.email) {
            const profilesByEmail = await queryDocuments<User>('users', 
              where('email', '==', user.email),
              limit(1)
            );
            if (profilesByEmail.length > 0) {
              profile = profilesByEmail[0];
              // Update seeded profile with actual Auth UID for future lookups
              // Note: This is an optimistic update
            }
          }

          dispatch({ type: 'SET_PROFILE', payload: profile });
          await syncCookies(user, profile);
        } catch (error) {
          console.error("Auth profile fetch error:", error);
          dispatch({ type: 'SET_PROFILE', payload: null });
        }
      } else {
        dispatch({ type: 'SET_PROFILE', payload: null });
        clearAuthCookies();
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return unsubscribe;
  }, []);

  const signOutAction = async () => {
    clearAuthCookies();
    await firebaseSignOut(auth);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      dispatch({ type: 'SET_USER', payload: updatedUser });
      if (state.userProfile) {
        await syncCookies(updatedUser, state.userProfile);
      }
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
