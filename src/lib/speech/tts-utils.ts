/**
 * TTS voice selection and speech utilities.
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
 * Get preferred TTS voice for given language.
 */
export function getPreferredVoice(
  voices: SpeechSynthesisVoice[],
  language: 'en' | 'ko'
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;

  const preferredNames =
    language === 'en' ? PREFERRED_EN_VOICES : PREFERRED_KO_VOICES;
  const langPrefix = language === 'en' ? 'en' : 'ko';
  const langVoices = voices.filter((v) => v.lang.startsWith(langPrefix));

  return (
    langVoices.find((v) =>
      preferredNames.some((n) => v.name.includes(n))
    ) ||
    langVoices[0] ||
    voices[0]
  );
}

/**
 * Speak text using Web Speech API.
 * Returns a cancel function.
 */
export function speakText(
  text: string,
  language: 'en' | 'ko',
  voices: SpeechSynthesisVoice[],
  options?: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options?.onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
  utterance.rate = options?.rate ?? 1.0;

  const voice = getPreferredVoice(voices, language);
  if (voice) utterance.voice = voice;

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = () => options.onEnd?.();
  }

  window.speechSynthesis.speak(utterance);

  return () => window.speechSynthesis.cancel();
}

/**
 * Load available voices (async, handles voiceschanged event).
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      resolve(v);
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);

    // Fallback timeout
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}
