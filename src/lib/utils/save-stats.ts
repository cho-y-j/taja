/**
 * 연습 세션 통계를 저장하는 유틸리티
 * - 로컬 스토어에 저장 (항상)
 * - 로그인된 경우 데이터베이스에도 저장
 */

import { useStatsStore } from '@/stores/stats-store';

export interface SessionData {
  type: string;
  locale?: string;
  wpm: number;
  accuracy: number;
  duration: number; // ms
  charactersTyped: number;
  errorsCount: number;
  contentId?: string;
}

/**
 * 연습 세션을 저장합니다
 * @param data 세션 데이터
 * @returns 성공 여부
 */
export async function saveSession(data: SessionData): Promise<boolean> {
  // 1. 항상 로컬 스토어에 저장
  const addSession = useStatsStore.getState().addSession;
  addSession({
    practiceType: data.type,
    wpm: data.wpm,
    accuracy: data.accuracy,
    duration: data.duration,
    errorCount: data.errorsCount,
    totalChars: data.charactersTyped,
    language: data.locale,
  });

  // 2. 로그인된 경우 데이터베이스에도 저장
  try {
    const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
    if (clerk?.session) {
      const res = await fetch('/api/user/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          locale: data.locale || 'ko',
          wpm: data.wpm,
          accuracy: data.accuracy,
          duration: Math.round(data.duration / 1000), // 초 단위로 변환
          charactersTyped: data.charactersTyped,
          errorsCount: data.errorsCount,
          contentId: data.contentId,
        }),
      });

      if (!res.ok) {
        console.error('Failed to save session to DB:', await res.text());
        return false;
      }

      return true;
    }
  } catch (error) {
    console.error('Error saving session to DB:', error);
  }

  return true; // 로컬 저장은 성공
}
