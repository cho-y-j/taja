'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useDocumentStore } from '@/stores/document-store';

/**
 * 로그인된 사용자의 문서를 DB와 동기화하는 컴포넌트
 * 앱의 최상위에 배치하면 로그인 시 자동으로 동기화
 */
export function DocumentSyncProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const { syncFromDB, lastSyncedAt, isSyncing } = useDocumentStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    // 로그인되었고, 아직 동기화하지 않았으면 동기화 실행
    if (isLoaded && isSignedIn && !hasSynced.current && !isSyncing) {
      hasSynced.current = true;
      syncFromDB();
    }

    // 로그아웃하면 동기화 상태 리셋
    if (isLoaded && !isSignedIn) {
      hasSynced.current = false;
    }
  }, [isLoaded, isSignedIn, syncFromDB, isSyncing]);

  return <>{children}</>;
}
