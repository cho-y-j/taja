'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useDocumentStore, type UserDocument } from '@/stores/document-store';

// DB 문서를 로컬 문서 형식으로 변환
function dbDocToLocal(dbDoc: {
  id: string;
  title: string;
  originalText: string | null;
  summary: string | null;
  locale: string;
  createdAt: Date;
}): UserDocument {
  return {
    id: dbDoc.id,
    name: dbDoc.title,
    content: dbDoc.originalText || '',
    language: dbDoc.locale === 'en' ? 'en' : 'ko',
    source: 'manual',
    summary: dbDoc.summary || undefined,
    createdAt: dbDoc.createdAt.toISOString(),
    updatedAt: dbDoc.createdAt.toISOString(),
  };
}

export function useDocumentSync() {
  const { documents, addDocument, updateDocument, deleteDocument } = useDocumentStore();
  const syncedRef = useRef(false);
  const isSyncingRef = useRef(false);

  // 로그인 상태 확인
  const isSignedIn = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
    return !!clerk?.session;
  }, []);

  // DB에서 문서 가져오기
  const fetchDocuments = useCallback(async () => {
    if (!isSignedIn() || isSyncingRef.current) return;

    try {
      isSyncingRef.current = true;
      const res = await fetch('/api/user/documents');
      if (!res.ok) return;

      const data = await res.json();
      const dbDocs: UserDocument[] = (data.documents || []).map(dbDocToLocal);

      // localStorage 문서 가져오기
      const localDocs = useDocumentStore.getState().documents;

      // 로컬에만 있는 문서를 DB에 저장
      for (const localDoc of localDocs) {
        const existsInDb = dbDocs.some(d => d.id === localDoc.id);
        if (!existsInDb) {
          // DB에 저장
          await fetch('/api/user/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: localDoc.name,
              originalText: localDoc.content,
              summary: localDoc.summary,
              locale: localDoc.language,
            }),
          });
        }
      }

      // DB에만 있는 문서를 로컬에 추가
      for (const dbDoc of dbDocs) {
        const existsInLocal = localDocs.some(d => d.id === dbDoc.id || d.name === dbDoc.name);
        if (!existsInLocal) {
          useDocumentStore.setState((state) => ({
            documents: [...state.documents, dbDoc],
          }));
        }
      }
    } catch (error) {
      console.error('Document sync error:', error);
    } finally {
      isSyncingRef.current = false;
    }
  }, [isSignedIn]);

  // 문서 생성 시 DB에도 저장
  const syncAddDocument = useCallback(async (doc: Omit<UserDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDoc = addDocument(doc);

    if (isSignedIn()) {
      try {
        await fetch('/api/user/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: doc.name,
            originalText: doc.content,
            summary: doc.summary,
            locale: doc.language,
          }),
        });
      } catch (error) {
        console.error('Failed to sync document to DB:', error);
      }
    }

    return newDoc;
  }, [addDocument, isSignedIn]);

  // 문서 삭제 시 DB에서도 삭제
  const syncDeleteDocument = useCallback(async (id: string) => {
    deleteDocument(id);

    if (isSignedIn()) {
      try {
        await fetch(`/api/user/documents?id=${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete document from DB:', error);
      }
    }
  }, [deleteDocument, isSignedIn]);

  // 초기 동기화
  useEffect(() => {
    if (syncedRef.current) return;

    const checkAndSync = () => {
      if (isSignedIn()) {
        syncedRef.current = true;
        fetchDocuments();
      }
    };

    // Clerk 로드 대기
    const interval = setInterval(checkAndSync, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    checkAndSync();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isSignedIn, fetchDocuments]);

  return {
    syncAddDocument,
    syncDeleteDocument,
    fetchDocuments,
  };
}
