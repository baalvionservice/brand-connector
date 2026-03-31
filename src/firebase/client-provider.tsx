
'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, db } = useMemo(() => initializeFirebase(), []);

  if (!app || !auth || !db) return null;

  return (
    <FirebaseProvider app={app} auth={auth} firestore={db}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
