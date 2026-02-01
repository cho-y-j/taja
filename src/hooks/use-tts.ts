'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

interface UseTTSOptions {
  language?: 'ko' | 'en';
}

export function useTTS(options: UseTTSOptions = {}) {
  const { language = 'ko' } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReady, setIsReady] = useState(false);
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
        setIsReady(true);
      }
    };

    // 즉시 로드 시도
    loadVoices();

    // Chrome에서는 voiceschanged 이벤트 후에 voices가 로드됨
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // 폴백: 여러 번 시도
    const timers = [
      setTimeout(loadVoices, 100),
      setTimeout(loadVoices, 300),
      setTimeout(loadVoices, 500),
      setTimeout(loadVoices, 1000),
    ];

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      timers.forEach(clearTimeout);
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
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) {
      console.log('[TTS] Not available:', { text: !!text, window: typeof window !== 'undefined' });
      return;
    }
    if (!ttsEnabled) {
      console.log('[TTS] TTS disabled in settings');
      return;
    }

    const targetLang = langOverride || language;
    console.log('[TTS] Speaking:', text.substring(0, 30), 'lang:', targetLang);

    // 이전 interval 정리
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }

    // 현재 재생 중인 것 취소
    window.speechSynthesis.cancel();

    // Chrome pause 버그 우회 - 주기적으로 resume 호출
    resumeIntervalRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          console.log('[TTS] Resuming paused speech');
          window.speechSynthesis.resume();
        }
        // 재생이 끝났으면 interval 정리
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          if (resumeIntervalRef.current) {
            clearInterval(resumeIntervalRef.current);
            resumeIntervalRef.current = null;
          }
        }
      }
    }, 200);

    // Chrome에서 cancel 후 약간 대기 필요
    setTimeout(() => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = getTTSRate();
      utterance.volume = ttsVolume;

      // 음성 선택
      const voice = getPreferredVoice(targetLang);
      if (voice) {
        utterance.voice = voice;
        console.log('[TTS] Using voice:', voice.name);
      } else {
        console.log('[TTS] No voice found, using default');
      }

      utterance.onstart = () => {
        console.log('[TTS] Started speaking');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('[TTS] Finished speaking');
        setIsSpeaking(false);
        if (resumeIntervalRef.current) {
          clearInterval(resumeIntervalRef.current);
          resumeIntervalRef.current = null;
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.error('[TTS] Error:', e.error);
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

      console.log('[TTS] speak() called, pending:', window.speechSynthesis.pending, 'speaking:', window.speechSynthesis.speaking);
    }, 150); // Chrome은 150ms 정도 대기 필요
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
    isReady,
    voices,
    ttsEnabled,
  };
}
