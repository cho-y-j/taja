'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

interface UseTTSOptions {
  language?: 'ko' | 'en';
}

// Chrome TTS 초기화 상태 (전역)
let ttsInitPromise: Promise<void> | null = null;
let isTTSReady = false;

// Chrome에서 TTS 초기화 (반드시 사용자 상호작용 후 호출)
async function initChromeTTS(): Promise<void> {
  if (isTTSReady) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // 이미 초기화 중이면 기다림
  if (ttsInitPromise) {
    return ttsInitPromise;
  }

  ttsInitPromise = new Promise<void>((resolve) => {
    // Chrome은 voices가 비동기로 로드됨 - 먼저 로드 대기
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // 워밍업 utterance 실행
        const warmup = new SpeechSynthesisUtterance(' '); // 공백 하나 (빈 문자열은 무시됨)
        warmup.volume = 0.01; // 거의 안들리게
        warmup.rate = 10; // 빠르게 끝나도록

        warmup.onend = () => {
          isTTSReady = true;
          resolve();
        };

        warmup.onerror = () => {
          // 에러 발생해도 초기화된 것으로 처리
          isTTSReady = true;
          resolve();
        };

        // 타임아웃 설정 (워밍업이 끝나지 않을 경우 대비)
        setTimeout(() => {
          if (!isTTSReady) {
            isTTSReady = true;
            resolve();
          }
        }, 500);

        window.speechSynthesis.speak(warmup);
      } else {
        // voices가 아직 없으면 다시 시도
        setTimeout(checkVoices, 50);
      }
    };

    // Chrome voiceschanged 이벤트 등록
    const onVoicesChanged = () => {
      checkVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
    };

    // 먼저 즉시 체크
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      checkVoices();
    } else {
      // Chrome: voiceschanged 이벤트 대기
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      // 폴백: 타임아웃 후 강제 진행
      setTimeout(() => {
        isTTSReady = true;
        resolve();
      }, 1000);
    }
  });

  return ttsInitPromise;
}

export function useTTS(options: UseTTSOptions = {}) {
  const { language = 'ko' } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReady, setIsReady] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakQueueRef = useRef<Array<{ text: string; lang: 'ko' | 'en' }>>([]);

  const { ttsEnabled, voiceGender, ttsVolume, getTTSRate } = useSettingsStore();

  // 사용자 상호작용 시 TTS 초기화
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    let mounted = true;

    const handleInteraction = async () => {
      await initChromeTTS();
      if (mounted) {
        setIsReady(true);
        // 대기 중인 speak 요청 처리
        if (speakQueueRef.current.length > 0) {
          const queued = speakQueueRef.current.shift();
          if (queued) {
            // 약간 지연 후 재생 (상태 업데이트 반영 대기)
            setTimeout(() => {
              speakInternal(queued.text, queued.lang);
            }, 100);
          }
        }
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    // 이미 초기화되었으면 바로 ready
    if (isTTSReady) {
      setIsReady(true);
    } else {
      document.addEventListener('click', handleInteraction);
      document.addEventListener('keydown', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);
    }

    return () => {
      mounted = false;
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

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

    // 폴백: 여러 번 시도
    const timers = [
      setTimeout(loadVoices, 100),
      setTimeout(loadVoices, 300),
      setTimeout(loadVoices, 500),
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

  // 내부 speak 함수 (이미 초기화된 상태에서만 호출)
  const speakInternal = useCallback((text: string, targetLang: 'ko' | 'en') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

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

    // Chrome에서 cancel 후 100ms 대기 필요
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
          console.warn('TTS error:', e.error, e);
        }
        setIsSpeaking(false);
        if (resumeIntervalRef.current) {
          clearInterval(resumeIntervalRef.current);
          resumeIntervalRef.current = null;
        }
      };

      utteranceRef.current = utterance;

      // Chrome resume 버그 우회 - 먼저 resume 호출
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 100); // Chrome은 100ms 이상 대기 필요
  }, [getTTSRate, ttsVolume, getPreferredVoice]);

  // 음성 재생 (외부에서 호출)
  const speak = useCallback((text: string, langOverride?: 'ko' | 'en') => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!ttsEnabled) return;

    const targetLang = langOverride || language;

    // 아직 초기화되지 않았으면 큐에 추가하고 초기화 시도
    if (!isReady && !isTTSReady) {
      speakQueueRef.current.push({ text, lang: targetLang });
      // 강제로 초기화 시도 (사용자 상호작용 가정)
      initChromeTTS().then(() => {
        setIsReady(true);
        const queued = speakQueueRef.current.shift();
        if (queued) {
          setTimeout(() => speakInternal(queued.text, queued.lang), 100);
        }
      });
      return;
    }

    speakInternal(text, targetLang);
  }, [language, ttsEnabled, isReady, speakInternal]);

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
