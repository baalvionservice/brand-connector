'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, db, storage } = useMemo(() => initializeFirebase(), []);

  if (!app || !auth || !db || !storage) return null;

  return (
    <FirebaseProvider app={app} auth={auth} firestore={db} storage={storage}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
