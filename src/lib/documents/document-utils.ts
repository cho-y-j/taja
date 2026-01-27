/**
 * Document text extraction utilities.
 * Converts raw document content into practiceable items.
 */

/**
 * Extract unique words from document content.
 * Filters to words >= 2 characters, deduplicates case-insensitively.
 */
export function extractWords(content: string): string[] {
  const wordRegex = /[\p{L}\p{N}]+/gu;
  const matches = content.match(wordRegex) || [];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const word of matches) {
    const key = word.toLowerCase();
    if (!seen.has(key) && word.length >= 2) {
      seen.add(key);
      unique.push(word);
    }
  }
  return unique;
}

/**
 * Build word practice sets from extracted words.
 * Groups words into sets of N, returns array of space-separated strings.
 */
export function buildWordPracticeSets(words: string[], setSize: number = 10): string[] {
  const sets: string[] = [];
  for (let i = 0; i < words.length; i += setSize) {
    sets.push(words.slice(i, i + setSize).join(' '));
  }
  return sets.length > 0 ? sets : [''];
}

/**
 * Extract sentences from document content.
 * Splits on sentence-ending punctuation and newlines.
 * Filters to sentences >= 5 characters.
 */
export function extractSentences(content: string): string[] {
  const raw = content.split(/(?<=[.!?。])\s+|\n+/);
  return raw.map((s) => s.trim()).filter((s) => s.length >= 5);
}

/**
 * Split document into paragraphs for full-text practice.
 * Splits on double-newlines, then chunks long paragraphs at sentence boundaries.
 */
export function extractParagraphs(
  content: string,
  maxLength: number = 150
): string[] {
  return content
    .split(/\n\n+/)
    .flatMap((p) => {
      const trimmed = p.trim();
      if (!trimmed) return [];
      if (trimmed.length <= maxLength) return [trimmed];

      // Split at sentence boundaries within the paragraph
      const sentences = trimmed.split(/(?<=[.!?。])\s+/);
      const chunks: string[] = [];
      let current = '';
      for (const sentence of sentences) {
        if (current.length + sentence.length > maxLength && current.length > 0) {
          chunks.push(current.trim());
          current = sentence;
        } else {
          current += (current ? ' ' : '') + sentence;
        }
      }
      if (current.trim()) chunks.push(current.trim());

      // Fallback to character chunking if no sentence boundaries
      if (chunks.length === 0) {
        for (let i = 0; i < trimmed.length; i += maxLength) {
          chunks.push(trimmed.slice(i, i + maxLength));
        }
      }
      return chunks;
    })
    .filter((p) => p.length > 0);
}

/**
 * Detect document language heuristically.
 * Checks ratio of Korean characters to total letters.
 */
export function detectLanguage(content: string): 'ko' | 'en' {
  const koreanChars = (
    content.match(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g) || []
  ).length;
  const totalAlpha = (content.match(/[\p{L}]/gu) || []).length;
  return totalAlpha > 0 && koreanChars / totalAlpha > 0.3 ? 'ko' : 'en';
}
