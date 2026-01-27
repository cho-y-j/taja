import { engToKorMap } from './korean-keyboard';

interface InputHandlerConfig {
  language: 'en' | 'ko';
  isComplete: boolean;
  isPaused: boolean;
  isStarted: boolean;
  processInput: (char: string) => void;
  processBackspace: () => void;
  startSession: () => void;
}

const SPECIAL_CHARS = ['.', ',', '!', '?', ' ', ':', ';', '"', "'", '(', ')', '-', '~'];

/**
 * Creates a unified keyDown handler for typing practice.
 * Handles Korean/English input, backspace, and session auto-start.
 */
export function createKeyDownHandler(config: InputHandlerConfig) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (config.isComplete || config.isPaused) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      config.processBackspace();
      return;
    }

    if (e.key.length !== 1) return;
    e.preventDefault();

    if (!config.isStarted) {
      config.startSession();
    }

    if (config.language === 'ko') {
      if (SPECIAL_CHARS.includes(e.key)) {
        config.processInput(e.key);
      } else {
        const koreanKey = engToKorMap[e.key.toLowerCase()];
        if (koreanKey) {
          config.processInput(koreanKey);
        }
      }
    } else {
      config.processInput(e.key);
    }
  };
}
