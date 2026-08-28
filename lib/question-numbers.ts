const STOP_PREFIX = /^(?:question|ques|q)\.?\s*/i;

export function normalizeQuestionNumber(raw: string): string {
  let value = raw.trim().toLowerCase();
  value = value.replace(STOP_PREFIX, "");
  value = value.replace(/[\s.:)/\\_-]+/g, "");
  value = value.replace(/[()[\]]/g, "");
  return value;
}

export function displayQuestionNumber(raw: string): string {
  const normalized = normalizeQuestionNumber(raw);
  const match = normalized.match(/^(\d+)([a-z])$/);
  if (match) {
    return `${match[1]}(${match[2]})`;
  }
  return normalized.replace(/^(\d+)$/, "$1");
}

const NUMBER_PATTERNS: RegExp[] = [
  /(?:^|\n)\s*(?:q(?:uestion)?\.?\s*)(\d+\s*[.\-:]?\s*[a-z]\b)/i,
  /(?:^|\n)\s*(?:q(?:uestion)?\.?\s*)(\d+)/i,
  /(?:^|\n)\s*(\d+\s*[\(\.\-]\s*[a-z]\s*\)?)/i,
  /(?:^|\n)\s*(\d+)\s*[.)]/,
  /\b(?:q(?:uestion)?\.?\s*)(\d+\s*[a-z]?)\b/i,
];

export function extractQuestionNumber(text: string): string | undefined {
  for (const pattern of NUMBER_PATTERNS) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const normalized = normalizeQuestionNumber(match[1]);
      if (normalized) return normalized;
    }
  }
  return undefined;
}

export function numbersMatch(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return normalizeQuestionNumber(a) === normalizeQuestionNumber(b);
}
