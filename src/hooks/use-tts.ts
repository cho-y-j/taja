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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
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
        // 여성 음성 우선
        const femaleVoices = ['Yuna', 'Google 한국어', 'Siri', 'Samantha'];
        const preferred = langVoices.find(v =>
          femaleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      } else {
        // 남성 음성 우선
        const maleVoices = ['Minsu', 'Google 한국어 남성'];
        const preferred = langVoices.find(v =>
          maleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      }
    } else {
      if (voiceGender === 'female') {
        const femaleVoices = ['Samantha', 'Karen', 'Moira', 'Fiona', 'Google US English Female'];
        const preferred = langVoices.find(v =>
          femaleVoices.some(name => v.name.includes(name))
        );
        return preferred || langVoices[0];
      } else {
        const maleVoices = ['Alex', 'Daniel', 'Fred', 'Google US English Male'];
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

    const targetLang = langOverride || language;

    // Chrome 버그 우회: 먼저 cancel
    window.speechSynthesis.cancel();

    // 이전 interval 정리
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }

    // Chrome에서 speechSynthesis가 pause 상태로 stuck되는 버그 우회
    // 주기적으로 resume() 호출
    resumeIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        if (resumeIntervalRef.current) {
          clearInterval(resumeIntervalRef.current);
          resumeIntervalRef.current = null;
        }
      }
    }, 100);

    // 약간의 지연 후 speak (Chrome에서 cancel 후 바로 speak하면 작동 안함)
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = getTTSRate();
      utterance.volume = ttsVolume;

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
        // Chrome에서 interrupted 에러는 무시
        if (e.error !== 'interrupted') {
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
    }, 100);
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
