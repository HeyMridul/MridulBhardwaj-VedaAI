import { displayQuestionNumber, normalizeQuestionNumber } from "@/lib/question-numbers";
import type { Question } from "@/lib/types";

const HEADER =
  /(?:^|\n)\s*(?:Q(?:uestion)?\.?\s*)?(\d{1,2})\s*(?:[.):\-]|[\u2013\u2014])\s*(?:\(([a-z])\)\s*)?/gi;

export function questionsFromPrintedText(source: string): Question[] {
  const text = source.replace(/\r/g, "").replace(/[ \t]+/g, " ");
  if (text.trim().length < 40) return [];

  const matches = [...text.matchAll(HEADER)];
  if (matches.length < 2) return [];

  const items: Question[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? text.length) : text.length;
    const numberPart = match[2] ? `${match[1]}${match[2]}` : match[1];
    const body = text.slice(start, end).trim();
    const marks = Number(body.match(/\[(\d{1,2})\]/)?.[1] ?? 0);
    const cleaned = body
      .replace(/\[\d{1,2}\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length < 12 || !/[a-z]/i.test(cleaned)) continue;

    const number = displayQuestionNumber(numberPart);
    const normalized = normalizeQuestionNumber(number);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);

    items.push({
      id: `q-${normalized}`,
      number,
      normalizedNumber: normalized,
      text: cleaned.slice(0, 600),
      maxMarks: marks > 0 ? marks : 2,
      order: items.length + 1,
    });
  }

  return items;
}
