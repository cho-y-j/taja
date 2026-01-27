import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserDocument {
  id: string;
  name: string;
  content: string;
  language: 'en' | 'ko';
  source: 'manual' | 'upload' | 'ai';
  aiPrompt?: string;
  translation?: string;
  summary?: string;
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
export type CreateSource = 'manual' | 'upload' | 'ai';

interface DocumentState {
  // Persisted
  documents: UserDocument[];

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
    doc: Omit<UserDocument, 'id' | 'createdAt' | 'updatedAt'>
  ) => UserDocument;
  updateDocument: (id: string, updates: Partial<UserDocument>) => void;
  deleteDocument: (id: string) => void;

  setDraft: (name: string, content: string, language: 'en' | 'ko') => void;
  clearDraft: () => void;
  startCreate: (source: CreateSource) => void;
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

export const useDocumentStore = create<DocumentState & DocumentActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setViewMode: (mode) => set({ viewMode: mode }),

      selectDocument: (id) =>
        set({ selectedDocumentId: id, viewMode: 'detail' }),

      selectPracticeMode: (mode) =>
        set({ selectedPracticeMode: mode, viewMode: 'practice', currentPracticeIndex: 0 }),

      addDocument: (doc) => {
        const now = new Date().toISOString();
        const newDoc: UserDocument = {
          ...doc,
          id: `doc-${Date.now()}`,
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

      startCreate: (source) =>
        set({
          viewMode: 'create',
          createSource: source,
          draftName: '',
          draftContent: '',
          draftLanguage: 'ko',
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
