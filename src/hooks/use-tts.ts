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
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
    setTimeout(loadVoices, 100);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // 성별에 맞는 음성 선택
  const getPreferredVoice = useCallback((lang: 'ko' | 'en') => {
    if (voices.length === 0) return undefined;

    const langCode = lang === 'ko' ? 'ko' : 'en';
    const langVoices = voices.filter(v => v.lang.startsWith(langCode));
    if (langVoices.length === 0) return undefined;

    if (lang === 'ko') {
      const preferred = voiceGender === 'female'
        ? langVoices.find(v => v.name.includes('Yuna') || v.name.includes('Google 한국어'))
        : langVoices.find(v => v.name.includes('Minsu'));
      return preferred || langVoices[0];
    } else {
      const preferred = voiceGender === 'female'
        ? langVoices.find(v => v.name.includes('Samantha') || v.name.includes('Karen'))
        : langVoices.find(v => v.name.includes('Daniel') || v.name.includes('Alex'));
      return preferred || langVoices[0];
    }
  }, [voices, voiceGender]);

  // 음성 재생 (간단한 버전)
  const speak = useCallback((text: string, langOverride?: 'ko' | 'en') => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!ttsEnabled) return;

    const targetLang = langOverride || language;

    // 이전 재생 취소
    window.speechSynthesis.cancel();

    // 약간 대기 후 새 utterance 생성
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = getTTSRate();
      utterance.volume = ttsVolume;

      const voice = getPreferredVoice(targetLang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [language, ttsEnabled, ttsVolume, getTTSRate, getPreferredVoice]);

  // 음성 정지
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: typeof window !== 'undefined' && !!window.speechSynthesis,
    isReady: voices.length > 0,
    voices,
    ttsEnabled,
  };
}
