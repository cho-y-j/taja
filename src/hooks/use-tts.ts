'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

interface UseTTSOptions {
  language?: 'ko' | 'en';
}

// Chrome 오디오 컨텍스트 활성화 상태
let audioContextUnlocked = false;

// Chrome 오디오 컨텍스트 활성화 (사용자 상호작용 필요)
function unlockAudioContext(): Promise<void> {
  return new Promise((resolve) => {
    if (audioContextUnlocked) {
      resolve();
      return;
    }

    try {
      // AudioContext 생성 및 resume
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        // 무음 버퍼 재생
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);

        ctx.resume().then(() => {
          audioContextUnlocked = true;
          console.log('[TTS] AudioContext unlocked');
          resolve();
        });
      } else {
        resolve();
      }
    } catch (e) {
      console.log('[TTS] AudioContext unlock failed:', e);
      resolve();
    }
  });
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

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

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
  const speak = useCallback(async (text: string, langOverride?: 'ko' | 'en') => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) {
      console.log('[TTS] Not available');
      return;
    }
    if (!ttsEnabled) {
      console.log('[TTS] Disabled');
      return;
    }

    const targetLang = langOverride || language;
    console.log('[TTS] Speaking:', text.substring(0, 30), 'lang:', targetLang);

    // Chrome 오디오 컨텍스트 활성화
    await unlockAudioContext();

    // 이전 interval 정리
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }

    // 현재 재생 중인 것 취소
    window.speechSynthesis.cancel();

    // Chrome resume 버그 우회 - 주기적으로 resume
    resumeIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis?.paused) {
        console.log('[TTS] Resuming...');
        window.speechSynthesis.resume();
      }
    }, 250);

    // Chrome에서 cancel 후 대기
    await new Promise(resolve => setTimeout(resolve, 100));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === 'ko' ? 'ko-KR' : 'en-US';
    utterance.rate = getTTSRate();
    utterance.volume = ttsVolume;

    const voice = getPreferredVoice(targetLang);
    if (voice) {
      utterance.voice = voice;
      console.log('[TTS] Voice:', voice.name);
    }

    utterance.onstart = () => {
      console.log('[TTS] Started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('[TTS] Ended');
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

    // Chrome 버그 우회 - resume 먼저
    window.speechSynthesis.resume();

    // speak 호출
    window.speechSynthesis.speak(utterance);

    // 상태 체크
    console.log('[TTS] After speak() - pending:', window.speechSynthesis.pending, 'speaking:', window.speechSynthesis.speaking);

    // Chrome 추가 우회 - 100ms 후에도 pending이면 다시 시도
    setTimeout(() => {
      if (window.speechSynthesis && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        console.log('[TTS] Retry speak...');
        window.speechSynthesis.speak(utterance);
      }
    }, 200);

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

  // 언마운트 시 정리
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

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: typeof window !== 'undefined' && !!window.speechSynthesis,
    isReady,
    voices,
    ttsEnabled,
  };
}
