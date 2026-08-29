import { toText } from "@/lib/text";

const STOP_PREFIX = /^(?:question|ques|q)\.?\s*/i;

export function normalizeQuestionNumber(raw: unknown): string {
  let value = toText(raw).trim().toLowerCase();
  value = value.replace(STOP_PREFIX, "");
  value = value.replace(/[\s.:)/\\_-]+/g, "");
  value = value.replace(/[()[\]]/g, "");
  return value;
}

export function displayQuestionNumber(raw: unknown): string {
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

export function extractQuestionNumber(text: unknown): string | undefined {
  const source = toText(text);
  for (const pattern of NUMBER_PATTERNS) {
    const match = source.match(pattern);
    if (match?.[1]) {
      const normalized = normalizeQuestionNumber(match[1]);
      if (normalized) return normalized;
    }
  }
  return undefined;
}

export function numbersMatch(a?: unknown, b?: unknown): boolean {
  if (a == null || b == null || toText(a) === "" || toText(b) === "") return false;
  return normalizeQuestionNumber(a) === normalizeQuestionNumber(b);
}
