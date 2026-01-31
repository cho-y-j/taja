import { create } from 'zustand';

interface CreditState {
  balance: number;
  totalUsed: number;
  hasSubscription: boolean;
  isLoading: boolean;
  showUpgradeModal: boolean;
  lastFetched: number | null;

  setBalance: (balance: number) => void;
  setCredits: (data: { balance: number; totalUsed: number; hasSubscription: boolean }) => void;
  setLoading: (loading: boolean) => void;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  fetchCredits: () => Promise<void>;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  balance: 0,
  totalUsed: 0,
  hasSubscription: false,
  isLoading: false,
  showUpgradeModal: false,
  lastFetched: null,

  setBalance: (balance) => set({ balance }),

  setCredits: (data) =>
    set({
      balance: data.balance,
      totalUsed: data.totalUsed,
      hasSubscription: data.hasSubscription,
      lastFetched: Date.now(),
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  openUpgradeModal: () => set({ showUpgradeModal: true }),

  closeUpgradeModal: () => set({ showUpgradeModal: false }),

  fetchCredits: async () => {
    const state = get();

    // 5분 이내에 fetch했으면 스킵
    if (state.lastFetched && Date.now() - state.lastFetched < 5 * 60 * 1000) {
      return;
    }

    set({ isLoading: true });

    try {
      const res = await fetch('/api/credits');
      if (res.ok) {
        const data = await res.json();
        set({
          balance: data.balance,
          totalUsed: data.totalUsed || 0,
          hasSubscription: data.hasSubscription || false,
          lastFetched: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
