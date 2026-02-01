import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 구조화된 학습 데이터
export interface StructuredContent {
  words: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
  sentences: Array<{
    original: string;
    translation: string;
  }>;
}

// DB에서 가져온 문서 타입 (API 응답)
interface DBDocument {
  id: string;
  userId: string;
  title: string;
  originalText: string | null;
  summary: string | null;
  structured: StructuredContent | null;
  locale: string | null;
  source: string | null;
  createdAt: string;
}

export interface UserDocument {
  id: string;
  name: string;
  content: string;
  language: 'en' | 'ko';
  source: 'manual' | 'upload' | 'ai' | 'url';
  aiPrompt?: string;
  sourceUrl?: string;
  // 구조화된 학습 데이터 (단어, 문장 + 번역)
  structured?: StructuredContent;
  translation?: string;
  summary?: string;
  // 번역 캐시: { "원문": "번역" }
  translationCache?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'list' | 'create' | 'detail' | 'practice';
export type PracticeMode =
  | 'words'
  | 'sentences'
  | 'summary'
  | 'full-text'
  | 'listen-write'
  | 'read-speak';
export type CreateSource = 'manual' | 'upload' | 'ai' | 'url';

interface DocumentState {
  // Persisted
  documents: UserDocument[];

  // Sync state
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;

  // UI state
  viewMode: ViewMode;
  createSource: CreateSource | null;
  selectedDocumentId: string | null;
  selectedPracticeMode: PracticeMode | null;

  // Draft
  draftName: string;
  draftContent: string;
  draftLanguage: 'en' | 'ko';
  editingDocumentId: string | null;

  // Practice
  practiceItems: string[];
  currentPracticeIndex: number;

  // AI state
  isGenerating: boolean;
  generationError: string | null;
}

interface DocumentActions {
  setViewMode: (mode: ViewMode) => void;
  selectDocument: (id: string) => void;
  selectPracticeMode: (mode: PracticeMode) => void;

  addDocument: (
    doc: Omit<UserDocument, 'id' | 'createdAt' | 'updatedAt'>,
    useId?: string  // DB에서 생성된 ID 사용
  ) => UserDocument;
  updateDocument: (id: string, updates: Partial<UserDocument>) => void;
  deleteDocument: (id: string) => void;

  // 번역 캐시
  addTranslation: (docId: string, original: string, translated: string) => void;
  getTranslation: (docId: string, original: string) => string | undefined;

  setDraft: (name: string, content: string, language: 'en' | 'ko') => void;
  clearDraft: () => void;
  startCreate: (source: CreateSource, language?: 'en' | 'ko') => void;
  startEdit: (docId: string) => void;

  setPracticeItems: (items: string[]) => void;
  nextPracticeItem: () => boolean;
  prevPracticeItem: () => void;
  setCurrentPracticeIndex: (index: number) => void;

  setGenerating: (v: boolean) => void;
  setGenerationError: (err: string | null) => void;

  backToList: () => void;
  backToDetail: () => void;

  getSelectedDocument: () => UserDocument | null;

  // DB 동기화
  syncFromDB: () => Promise<void>;
  setDocuments: (docs: UserDocument[]) => void;
}

// Migrate old localStorage data
function migrateOldDocuments(): UserDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const old = localStorage.getItem('lit-type-documents');
    if (!old) return [];
    const docs = JSON.parse(old) as Array<{
      id: string;
      name: string;
      content: string;
      createdAt: string;
    }>;
    return docs.map((d) => ({
      id: d.id,
      name: d.name,
      content: d.content,
      language: 'ko' as const,
      source: 'manual' as const,
      createdAt: d.createdAt,
      updatedAt: d.createdAt,
    }));
  } catch {
    return [];
  }
}

const initialState: DocumentState = {
  documents: [],
  isSyncing: false,
  lastSyncedAt: null,
  syncError: null,
  viewMode: 'list',
  createSource: null,
  selectedDocumentId: null,
  selectedPracticeMode: null,
  draftName: '',
  draftContent: '',
  draftLanguage: 'ko',
  editingDocumentId: null,
  practiceItems: [],
  currentPracticeIndex: 0,
  isGenerating: false,
  generationError: null,
};

// DB 문서를 로컬 형식으로 변환
function convertDBDocToLocal(dbDoc: DBDocument): UserDocument {
  return {
    id: dbDoc.id,
    name: dbDoc.title,
    content: dbDoc.originalText || '',
    language: (dbDoc.locale === 'en' ? 'en' : 'ko') as 'en' | 'ko',
    source: (dbDoc.source || 'manual') as 'manual' | 'upload' | 'ai' | 'url',
    structured: dbDoc.structured || undefined,
    summary: dbDoc.summary || undefined,
    createdAt: dbDoc.createdAt,
    updatedAt: dbDoc.createdAt,
  };
}

export const useDocumentStore = create<DocumentState & DocumentActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setViewMode: (mode) => set({ viewMode: mode }),

      selectDocument: (id) =>
        set({ selectedDocumentId: id, viewMode: 'detail' }),

      selectPracticeMode: (mode) =>
        set({ selectedPracticeMode: mode, viewMode: 'practice', currentPracticeIndex: 0 }),

      addDocument: (doc, useId) => {
        const now = new Date().toISOString();
        const newDoc: UserDocument = {
          ...doc,
          id: useId || `doc-${Date.now()}`,  // DB ID가 있으면 사용
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          documents: [newDoc, ...state.documents],
        }));
        return newDoc;
      },

      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d
          ),
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
          selectedDocumentId:
            state.selectedDocumentId === id ? null : state.selectedDocumentId,
          viewMode: state.selectedDocumentId === id ? 'list' : state.viewMode,
        })),

      addTranslation: (docId, original, translated) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === docId
              ? {
                  ...d,
                  translationCache: {
                    ...d.translationCache,
                    [original]: translated,
                  },
                }
              : d
          ),
        })),

      getTranslation: (docId, original) => {
        const doc = get().documents.find((d) => d.id === docId);
        return doc?.translationCache?.[original];
      },

      setDraft: (name, content, language) =>
        set({ draftName: name, draftContent: content, draftLanguage: language }),

      clearDraft: () =>
        set({
          draftName: '',
          draftContent: '',
          draftLanguage: 'ko',
          editingDocumentId: null,
          createSource: null,
        }),

      startCreate: (source, language) =>
        set({
          viewMode: 'create',
          createSource: source,
          draftName: '',
          draftContent: '',
          draftLanguage: language || 'ko',
          editingDocumentId: null,
        }),

      startEdit: (docId) => {
        const doc = get().documents.find((d) => d.id === docId);
        if (!doc) return;
        set({
          viewMode: 'create',
          createSource: null,
          draftName: doc.name,
          draftContent: doc.content,
          draftLanguage: doc.language,
          editingDocumentId: docId,
        });
      },

      setPracticeItems: (items) =>
        set({ practiceItems: items, currentPracticeIndex: 0 }),

      nextPracticeItem: () => {
        const state = get();
        if (state.currentPracticeIndex < state.practiceItems.length - 1) {
          set({ currentPracticeIndex: state.currentPracticeIndex + 1 });
          return true;
        }
        return false;
      },

      prevPracticeItem: () => {
        const state = get();
        if (state.currentPracticeIndex > 0) {
          set({ currentPracticeIndex: state.currentPracticeIndex - 1 });
        }
      },

      setCurrentPracticeIndex: (index) => set({ currentPracticeIndex: index }),

      setGenerating: (v) => set({ isGenerating: v }),
      setGenerationError: (err) => set({ generationError: err }),

      backToList: () =>
        set({
          viewMode: 'list',
          selectedDocumentId: null,
          selectedPracticeMode: null,
          practiceItems: [],
          currentPracticeIndex: 0,
        }),

      backToDetail: () =>
        set({
          viewMode: 'detail',
          selectedPracticeMode: null,
          practiceItems: [],
          currentPracticeIndex: 0,
        }),

      getSelectedDocument: () => {
        const state = get();
        return (
          state.documents.find((d) => d.id === state.selectedDocumentId) || null
        );
      },

      // DB 동기화 - 서버에서 문서 가져오기
      syncFromDB: async () => {
        set({ isSyncing: true, syncError: null });
        try {
          const res = await fetch('/api/user/documents');
          if (!res.ok) {
            throw new Error('Failed to fetch documents');
          }
          const data = await res.json();
          const dbDocs: DBDocument[] = data.documents || [];

          // DB 문서를 로컬 형식으로 변환
          const localDocs = dbDocs.map(convertDBDocToLocal);

          // 기존 로컬 문서와 병합 (DB 문서 우선, 로컬만 있는 것은 유지)
          const state = get();
          const dbDocIds = new Set(localDocs.map(d => d.id));
          const localOnlyDocs = state.documents.filter(d => !dbDocIds.has(d.id));

          // DB 문서 + 로컬만 있는 문서 (DB에 없는 것)
          const mergedDocs = [...localDocs, ...localOnlyDocs];

          set({
            documents: mergedDocs,
            isSyncing: false,
            lastSyncedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Sync error:', error);
          set({
            isSyncing: false,
            syncError: error instanceof Error ? error.message : 'Sync failed',
          });
        }
      },

      setDocuments: (docs) => set({ documents: docs }),
    }),
    {
      name: 'lit-type-documents-v2',
      partialize: (state) => ({ documents: state.documents }),
      onRehydrateStorage: () => (state) => {
        // Migrate old documents on first load
        if (state && state.documents.length === 0) {
          const migrated = migrateOldDocuments();
          if (migrated.length > 0) {
            state.documents = migrated;
          }
        }
      },
    }
  )
);
