'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Language = 'en' | 'ko';

interface UseTTSOptions {
  language?: Language;
  rate?: number;
  autoSpeak?: boolean;
}

interface UseTTSReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

const PREFERRED_VOICES: Record<Language, string[]> = {
  en: ['Google US English', 'Samantha', 'Alex', 'Daniel', 'Karen', 'Moira'],
  ko: ['Google 한국어', 'Yuna'],
};

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const { language = 'en', rate = 0.9 } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

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
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Get preferred voice for language
  const getPreferredVoice = useCallback(
    (lang: Language): SpeechSynthesisVoice | undefined => {
      if (voices.length === 0) return undefined;

      const langCode = lang === 'en' ? 'en' : 'ko';
      const langVoices = voices.filter((v) => v.lang.startsWith(langCode));
      const preferred = langVoices.find((v) =>
        PREFERRED_VOICES[lang].some((name) => v.name.includes(name))
      );

      return preferred || langVoices[0] || undefined;
    },
    [voices]
  );

  // Speak text
  const speak = useCallback(
    (text: string) => {
      if (!text || !isSupported || typeof window === 'undefined') return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = rate;

      const voice = getPreferredVoice(language);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [language, rate, isSupported, getPreferredVoice]
  );

  // Stop speaking
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
}
