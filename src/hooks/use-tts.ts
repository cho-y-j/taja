'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

interface UseTTSOptions {
  language?: 'ko' | 'en';
}

// Chrome TTS 초기화 상태
let isChromeTTSInitialized = false;

// Chrome TTS 초기화 (첫 사용자 상호작용 시 호출)
function initChromeTTS() {
  if (isChromeTTSInitialized) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // 빈 utterance로 TTS 엔진 "워밍업"
  const warmup = new SpeechSynthesisUtterance('');
  warmup.volume = 0;
  window.speechSynthesis.speak(warmup);
  window.speechSynthesis.cancel();
  isChromeTTSInitialized = true;
}

// 페이지 로드 시 클릭 이벤트에서 초기화
if (typeof window !== 'undefined') {
  const initOnInteraction = () => {
    initChromeTTS();
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('keydown', initOnInteraction);
  };
  document.addEventListener('click', initOnInteraction);
  document.addEventListener('keydown', initOnInteraction);
}

export function useTTS(options: UseTTSOptions = {}) {
  const { language = 'ko' } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ttsEnabled, voiceGender, ttsVolume, getTTSRate } = useSettingsStore();

  // 음성 목록 로드
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    // 즉시 로드 시도
    loadVoices();

    // Chrome에서는 voiceschanged 이벤트 후에 voices가 로드됨
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // 폴백: 200ms 후 다시 시도
    const fallbackTimer = setTimeout(loadVoices, 200);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      clearTimeout(fallbackTimer);
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
      }
    };
  }, []);

  // 성별에 맞는 음성 선택
  const getPreferredVoice = useCallback((lang: 'ko' | 'en') => {
    if (voices.length === 0) return undefined;

    const langCode = lang === 'ko' ? 'ko' : 'en';
    const langVoices = voices.filter(v => v.lang.startsWith(langCode));

    if (langVoices.length === 0) return undefined;

    // 성별에 따른 음성 선택
    if (lang === 'ko') {
      if (voiceGender === 'female') {
        const femaleVoices = ['Yuna', 'Google 한국어', 'Siri'];
        const preferred = langVoices.find(v =>
          femaleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      } else {
        const maleVoices = ['Minsu', 'Google 한국어 남성'];
        const preferred = langVoices.find(v =>
          maleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      }
    } else {
      if (voiceGender === 'female') {
        const femaleVoices = ['Samantha', 'Karen', 'Moira', 'Fiona', 'Google US English'];
        const preferred = langVoices.find(v =>
          femaleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      } else {
        const maleVoices = ['Alex', 'Daniel', 'Fred', 'Google US English'];
        const preferred = langVoices.find(v =>
          maleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      }
    }
  }, [voices, voiceGender]);

  // 음성 재생
  const speak = useCallback((text: string, langOverride?: 'ko' | 'en') => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!ttsEnabled) return;

    // Chrome TTS 초기화 확인
    initChromeTTS();

    const targetLang = langOverride || language;

    // 이전 interval 정리
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }

    // 현재 재생 중인 것 취소
    window.speechSynthesis.cancel();

    // Chrome에서 speechSynthesis가 pause 상태로 stuck되는 버그 우회
    resumeIntervalRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          if (resumeIntervalRef.current) {
            clearInterval(resumeIntervalRef.current);
            resumeIntervalRef.current = null;
          }
        }
      }
    }, 100);

    // 지연 후 speak (Chrome에서 cancel 후 바로 speak하면 작동 안함)
    setTimeout(() => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = getTTSRate();
      utterance.volume = ttsVolume;

      // 음성 선택 (voices가 비어있어도 기본 음성 사용)
      const voice = getPreferredVoice(targetLang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (resumeIntervalRef.current) {
          clearInterval(resumeIntervalRef.current);
          resumeIntervalRef.current = null;
        }
      };
      utterance.onerror = (e) => {
        // interrupted는 cancel() 호출 시 발생하므로 무시
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('TTS error:', e.error);
        }
        setIsSpeaking(false);
        if (resumeIntervalRef.current) {
          clearInterval(resumeIntervalRef.current);
          resumeIntervalRef.current = null;
        }
      };

      utteranceRef.current = utterance;

      // Chrome resume 버그 우회
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [language, ttsEnabled, ttsVolume, getTTSRate, getPreferredVoice]);

  // 음성 정지
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
        resumeIntervalRef.current = null;
      }
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
      }
    };
  }, []);

  const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    ttsEnabled,
  };
}
