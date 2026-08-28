import type { Answer, Mapping, Question } from "@/lib/types";
import {
  extractQuestionNumber,
  normalizeQuestionNumber,
} from "@/lib/question-numbers";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "this",
  "from",
  "are",
  "was",
  "were",
  "have",
  "has",
  "been",
  "which",
  "what",
  "when",
  "where",
  "how",
  "into",
  "onto",
  "than",
  "then",
  "also",
  "only",
  "each",
  "their",
  "them",
  "they",
  "briefly",
  "explain",
  "describe",
  "name",
  "draw",
  "label",
  "labelled",
  "diagram",
  "following",
  "primarily",
  "involved",
]);

const SEMANTIC_THRESHOLD = 0.22;
const CONTEXTUAL_THRESHOLD = 0.5;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

export function semanticSimilarity(a: string, b: string): number {
  const left = tokenize(a);
  const right = tokenize(b);
  if (left.size === 0 || right.size === 0) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  const union = new Set([...left, ...right]).size;
  const jaccard = intersection / union;

  const coverage = intersection / Math.min(left.size, right.size);
  return Math.min(1, jaccard * 0.55 + coverage * 0.45);
}

function uniqueTermBoost(
  answerText: string,
  question: Question,
  pool: Question[],
): number {
  const answerTokens = tokenize(answerText);
  const questionTokens = tokenize(question.text);
  let boost = 0;

  for (const token of answerTokens) {
    if (!questionTokens.has(token) || token.length < 4) continue;
    const appearsIn = pool.filter((item) => tokenize(item.text).has(token)).length;
    if (appearsIn === 1) boost += 0.28;
    else if (appearsIn === 2) boost += 0.08;
  }

  return Math.min(0.55, boost);
}

function firstPage(answer: Answer): number {
  return answer.pages[0] ?? answer.regions[0]?.page ?? 1;
}

function firstY(answer: Answer): number {
  return answer.regions[0]?.y ?? 0;
}

function documentOrder(a: Answer, b: Answer): number {
  const pageDiff = firstPage(a) - firstPage(b);
  if (pageDiff !== 0) return pageDiff;
  return firstY(a) - firstY(b);
}

export function mapAnswers(
  questions: Question[],
  answers: Answer[],
): Mapping[] {
  const mappings: Mapping[] = [];
  const usedQuestionIds = new Set<string>();
  const usedAnswerIds = new Set<string>();

  const questionsByNumber = new Map<string, Question>();
  for (const question of questions) {
    questionsByNumber.set(question.normalizedNumber, question);
  }

  const orderedAnswers = [...answers].sort(documentOrder);

  for (const answer of orderedAnswers) {
    const detected =
      answer.detectedQuestionNumber ?? extractQuestionNumber(answer.text);
    if (!detected) continue;

    const normalized = normalizeQuestionNumber(detected);
    const question = questionsByNumber.get(normalized);

    if (!question) {
      mappings.push({
        id: `unmatched-${answer.id}`,
        answerId: answer.id,
        confidence: Math.max(answer.confidence, 0.9),
        status: "unmatched",
        method: "question-number",
      });
      usedAnswerIds.add(answer.id);
      continue;
    }

    if (usedQuestionIds.has(question.id)) continue;

    mappings.push({
      id: `map-${question.id}-${answer.id}`,
      questionId: question.id,
      answerId: answer.id,
      confidence: Math.max(answer.confidence, 0.92),
      status: "mapped",
      method: "question-number",
    });
    usedQuestionIds.add(question.id);
    usedAnswerIds.add(answer.id);
  }

  const remainingAnswers = orderedAnswers.filter(
    (answer) => !usedAnswerIds.has(answer.id),
  );
  const remainingQuestions = questions.filter(
    (question) => !usedQuestionIds.has(question.id),
  );

  for (const answer of remainingAnswers) {
    let best: { question: Question; score: number } | null = null;
    for (const question of remainingQuestions) {
      if (usedQuestionIds.has(question.id)) continue;
      const score = Math.min(
        1,
        semanticSimilarity(question.text, answer.text) +
          uniqueTermBoost(answer.text, question, remainingQuestions),
      );
      if (!best || score > best.score) {
        best = { question, score };
      }
    }

    if (best && best.score >= SEMANTIC_THRESHOLD) {
      const uncertain = best.score < 0.45;
      mappings.push({
        id: `map-${best.question.id}-${answer.id}`,
        questionId: best.question.id,
        answerId: answer.id,
        confidence: Number(best.score.toFixed(2)),
        status: uncertain ? "uncertain" : "mapped",
        method: "semantic",
      });
      usedQuestionIds.add(best.question.id);
      usedAnswerIds.add(answer.id);
    }
  }

  const stillOpenAnswers = orderedAnswers.filter(
    (answer) => !usedAnswerIds.has(answer.id),
  );
  const stillOpenQuestions = questions.filter(
    (question) => !usedQuestionIds.has(question.id),
  );

  if (stillOpenAnswers.length === 1 && stillOpenQuestions.length === 1) {
    const answer = stillOpenAnswers[0];
    const question = stillOpenQuestions[0];
    const neighbors = mappings.filter(
      (mapping) => mapping.questionId && mapping.answerId,
    );
    if (neighbors.length >= 2) {
      mappings.push({
        id: `map-${question.id}-${answer.id}`,
        questionId: question.id,
        answerId: answer.id,
        confidence: CONTEXTUAL_THRESHOLD,
        status: "uncertain",
        method: "contextual",
      });
      usedQuestionIds.add(question.id);
      usedAnswerIds.add(answer.id);
    }
  }

  for (const question of questions) {
    if (usedQuestionIds.has(question.id)) continue;
    mappings.push({
      id: `unanswered-${question.id}`,
      questionId: question.id,
      confidence: 1,
      status: "unanswered",
      method: "none",
    });
  }

  for (const answer of answers) {
    if (usedAnswerIds.has(answer.id)) continue;
    mappings.push({
      id: `unmatched-${answer.id}`,
      answerId: answer.id,
      confidence: answer.confidence,
      status: "unmatched",
      method: "none",
    });
  }

  return mappings;
}

export function averageMappingConfidence(mappings: Mapping[]): number {
  const scored = mappings.filter(
    (mapping) => mapping.status === "mapped" || mapping.status === "uncertain",
  );
  if (scored.length === 0) return 1;
  return scored.reduce((sum, mapping) => sum + mapping.confidence, 0) / scored.length;
}
