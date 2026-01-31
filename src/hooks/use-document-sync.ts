'use client';

import { useEffect, useRef } from 'react';
import { useDocumentStore, type UserDocument } from '@/stores/document-store';

export function useDocumentSync() {
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current) return;

    const syncDocuments = async () => {
      // Clerk 로그인 확인
      const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
      if (!clerk?.session) return;

      try {
        // DB에서 문서 가져오기
        const res = await fetch('/api/user/documents');
        if (!res.ok) return;

        const data = await res.json();
        const dbDocs = data.documents || [];

        if (dbDocs.length === 0) return;

        // 현재 로컬 문서
        const localDocs = useDocumentStore.getState().documents;

        // DB 문서를 로컬 형식으로 변환하여 추가
        const newDocs: UserDocument[] = [];
        for (const dbDoc of dbDocs) {
          // 이미 로컬에 같은 제목의 문서가 있으면 스킵
          const exists = localDocs.some(
            (d) => d.name === dbDoc.title || d.id === dbDoc.id
          );
          if (!exists) {
            newDocs.push({
              id: dbDoc.id,
              name: dbDoc.title,
              content: dbDoc.originalText || '',
              language: dbDoc.locale === 'en' ? 'en' : 'ko',
              source: 'manual',
              summary: dbDoc.summary || undefined,
              createdAt: dbDoc.createdAt,
              updatedAt: dbDoc.createdAt,
            });
          }
        }

        // 새 문서가 있으면 store에 추가
        if (newDocs.length > 0) {
          useDocumentStore.setState((state) => ({
            documents: [...newDocs, ...state.documents],
          }));
          console.log(`DB에서 ${newDocs.length}개 문서 동기화됨`);
        }

        syncedRef.current = true;
      } catch (error) {
        console.error('문서 동기화 실패:', error);
      }
    };

    // Clerk 로드 대기 후 동기화
    const checkAndSync = () => {
      const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
      if (clerk) {
        syncDocuments();
        return true;
      }
      return false;
    };

    // 즉시 체크
    if (!checkAndSync()) {
      // Clerk 로드 대기
      const interval = setInterval(() => {
        if (checkAndSync()) {
          clearInterval(interval);
        }
      }, 300);

      // 5초 후 타임아웃
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, []);
}
