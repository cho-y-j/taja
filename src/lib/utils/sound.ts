/**
 * Typing sound effects using Web Audio API.
 * Lightweight — no external dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 설정 스토어에서 값을 가져오는 헬퍼
function getSettings(): { keySound: boolean; errorSound: boolean } {
  if (typeof window === 'undefined') return { keySound: true, errorSound: true };
  try {
    const stored = localStorage.getItem('taja-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        keySound: parsed.state?.keySound ?? true,
        errorSound: parsed.state?.errorSound ?? true,
      };
    }
  } catch {
    // ignore
  }
  return { keySound: true, errorSound: true };
}

/** Short error buzz (low tone, ~80ms) */
export function playErrorSound(): void {
  const settings = getSettings();
  if (!settings.errorSound) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(220, ctx.currentTime);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.08);
}

/** Soft key click (high tone, ~30ms) */
export function playKeySound(): void {
  const settings = getSettings();
  if (!settings.keySound) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);

  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.03);
}
