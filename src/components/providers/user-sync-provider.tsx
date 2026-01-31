'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !hasSynced.current) {
      hasSynced.current = true;

      // 사용자 DB 동기화
      fetch('/api/user/sync', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.isNew) {
            console.log('New user synced with 200 credits');
          }
        })
        .catch((err) => {
          console.error('User sync failed:', err);
        });
    }
  }, [isLoaded, isSignedIn]);

  return <>{children}</>;
}
