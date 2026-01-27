import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PracticeSession {
  id: string;
  date: string; // ISO string
  practiceType: string;
  wpm: number;
  accuracy: number;
  duration: number; // ms
  errorCount: number;
  totalChars: number;
  language?: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  sessions: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTime: number; // ms
  totalChars: number;
}

interface StatsState {
  sessions: PracticeSession[];
  addSession: (session: Omit<PracticeSession, 'id' | 'date'>) => void;
  clearAll: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      sessions: [],

      addSession: (session) => {
        const newSession: PracticeSession = {
          ...session,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
        }));
      },

      clearAll: () => set({ sessions: [] }),
    }),
    {
      name: 'lit-type-stats-v1',
    }
  )
);

// --- Helper functions (pure, not in store) ---

export function getTodaySessions(sessions: PracticeSession[]): PracticeSession[] {
  const today = new Date().toISOString().slice(0, 10);
  return sessions.filter((s) => s.date.slice(0, 10) === today);
}

export function getStreak(sessions: PracticeSession[]): { current: number; longest: number } {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  // Get unique practice dates (YYYY-MM-DD), sorted descending
  const dates = [...new Set(sessions.map((s) => s.date.slice(0, 10)))].sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Current streak: must include today or yesterday
  let current = 0;
  if (dates[0] === today || dates[0] === yesterday) {
    let checkDate = new Date(dates[0]);
    for (const d of dates) {
      const expected = checkDate.toISOString().slice(0, 10);
      if (d === expected) {
        current++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else {
        break;
      }
    }
  }

  // Longest streak
  let longest = 0;
  let streak = 0;
  const sortedAsc = [...dates].reverse();
  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(sortedAsc[i - 1]);
      const curr = new Date(sortedAsc[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      streak = diff === 1 ? streak + 1 : 1;
    }
    longest = Math.max(longest, streak);
  }

  return { current, longest };
}

export function getDailyStats(sessions: PracticeSession[], days: number): DailyStats[] {
  const result: DailyStats[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const daySessions = sessions.filter((s) => s.date.slice(0, 10) === dateStr);

    if (daySessions.length === 0) {
      result.push({
        date: dateStr,
        sessions: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalTime: 0,
        totalChars: 0,
      });
    } else {
      const avgWpm = Math.round(
        daySessions.reduce((sum, s) => sum + s.wpm, 0) / daySessions.length
      );
      const avgAccuracy = Math.round(
        (daySessions.reduce((sum, s) => sum + s.accuracy, 0) / daySessions.length) * 10
      ) / 10;
      const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const totalChars = daySessions.reduce((sum, s) => sum + s.totalChars, 0);

      result.push({
        date: dateStr,
        sessions: daySessions.length,
        avgWpm,
        avgAccuracy,
        totalTime,
        totalChars,
      });
    }
  }

  return result;
}

export function getPracticeTypeStats(sessions: PracticeSession[]) {
  const map: Record<string, { count: number; avgWpm: number; avgAccuracy: number }> = {};
  for (const s of sessions) {
    if (!map[s.practiceType]) {
      map[s.practiceType] = { count: 0, avgWpm: 0, avgAccuracy: 0 };
    }
    map[s.practiceType].count++;
    map[s.practiceType].avgWpm += s.wpm;
    map[s.practiceType].avgAccuracy += s.accuracy;
  }
  return Object.entries(map).map(([type, data]) => ({
    type,
    count: data.count,
    avgWpm: Math.round(data.avgWpm / data.count),
    avgAccuracy: Math.round((data.avgAccuracy / data.count) * 10) / 10,
  }));
}
