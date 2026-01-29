/**
 * TTS (Text-to-Speech) utilities
 * 단순하고 안정적인 구조로 재작성
 */

const PREFERRED_EN_VOICES = [
  'Google US English',
  'Samantha',
  'Alex',
  'Daniel',
  'Karen',
  'Moira',
];

const PREFERRED_KO_VOICES = ['Google 한국어', 'Yuna'];

/**
 * 언어에 맞는 최적의 음성 선택
 */
export function getPreferredVoice(
  voices: SpeechSynthesisVoice[],
  language: 'en' | 'ko'
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;

  const preferredNames = language === 'en' ? PREFERRED_EN_VOICES : PREFERRED_KO_VOICES;
  const langPrefix = language === 'en' ? 'en' : 'ko';
  const langVoices = voices.filter((v) => v.lang.startsWith(langPrefix));

  return (
    langVoices.find((v) => preferredNames.some((n) => v.name.includes(n))) ||
    langVoices[0] ||
    voices[0]
  );
}

/**
 * 음성 목록 로드 (Promise)
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // voiceschanged 이벤트 대기
    const handler = () => {
      synth.removeEventListener('voiceschanged', handler);
      resolve(synth.getVoices());
    };
    synth.addEventListener('voiceschanged', handler);

    // 타임아웃 (1초)
    setTimeout(() => {
      synth.removeEventListener('voiceschanged', handler);
      resolve(synth.getVoices());
    }, 1000);
  });
}

/**
 * 텍스트 읽기 (간단한 버전)
 * @returns cancel 함수
 */
export function speakText(
  text: string,
  language: 'en' | 'ko',
  options?: {
    rate?: number;
    voice?: SpeechSynthesisVoice;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options?.onError?.('speechSynthesis not supported');
    return () => {};
  }

  if (!text || text.trim().length === 0) {
    options?.onEnd?.();
    return () => {};
  }

  const synth = window.speechSynthesis;

  // 현재 재생 중인 것 취소
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
  utterance.rate = options?.rate ?? 1.0;

  if (options?.voice) {
    utterance.voice = options.voice;
  }

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = (e) => options?.onError?.(e.error);

  synth.speak(utterance);

  return () => {
    synth.cancel();
  };
}
