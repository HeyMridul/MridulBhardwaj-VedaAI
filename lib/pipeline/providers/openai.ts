import { friendlyAiError, getAiConfig, parseModelJson } from "@/lib/pipeline/ai-config";
import { mapAnswers } from "@/lib/pipeline/answer-mapper";
import { applyRubricLookup, gradeFromScore } from "@/lib/pipeline/grader";
import { buildSummary } from "@/lib/pipeline/summary";
import { displayQuestionNumber, normalizeQuestionNumber } from "@/lib/question-numbers";
import { toText, trimmed } from "@/lib/text";
import type {
  Answer,
  AssessmentResult,
  BoundingBox,
  DocumentPage,
  ProcessAssessmentInput,
  Question,
} from "@/lib/types";

export { isLiveAiConfigured } from "@/lib/pipeline/ai-config";

type VisionQuestion = {
  number?: string | number;
  text?: unknown;
  maxMarks?: number;
};

type VisionAnswer = {
  detectedQuestionNumber?: string | number;
  text?: unknown;
  confidence?: number;
  regions?: BoundingBox[];
};

function getConfig() {
  return getAiConfig();
}

async function completeJson(args: {
  system: string;
  userText: string;
  images: DocumentPage[];
}): Promise<unknown> {
  const { apiKey, model, baseUrl } = getConfig();
  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured.");
  }

  const imageContent = args.images.slice(0, 6).map((page) => ({
    type: "image_url" as const,
    image_url: { url: page.src },
  }));

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${args.system} Always respond with a single JSON object only.`,
        },
        {
          role: "user",
          content: [{ type: "text", text: args.userText }, ...imageContent],
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(friendlyAiError(response.status, detail));
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: unknown } }[];
    error?: { message?: string };
  };
  const content = payload.choices?.[0]?.message?.content;
  if (content == null || content === "") {
    throw new Error(
      payload.error?.message || "The AI provider returned an empty response.",
    );
  }
  return parseModelJson(content);
}

function listFromModel<T>(raw: unknown, key: string): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const value = (raw as Record<string, unknown>)[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export function asQuestions(raw: unknown): Question[] {
  const items = listFromModel<VisionQuestion>(raw, "questions");
  return items.map((item, index) => {
    const number = displayQuestionNumber(item.number ?? index + 1);
    return {
      id: `q-${normalizeQuestionNumber(number) || index + 1}`,
      number,
      normalizedNumber: normalizeQuestionNumber(number),
      text: trimmed(item.text) || "Untitled question",
      maxMarks: item.maxMarks && item.maxMarks > 0 ? item.maxMarks : 2,
      order: index + 1,
    };
  });
}

export function asAnswers(raw: unknown): Answer[] {
  const items = listFromModel<VisionAnswer>(raw, "answers");
  return items.map((item, index) => {
    const regions = (item.regions ?? []).map((region) => ({
      page: region.page || 1,
      x: clamp01(region.x),
      y: clamp01(region.y),
      width: clamp01(region.width),
      height: clamp01(region.height),
    }));
    return {
      id: `a-${index + 1}`,
      detectedQuestionNumber:
        item.detectedQuestionNumber == null
          ? undefined
          : toText(item.detectedQuestionNumber),
      text: trimmed(item.text),
      confidence: item.confidence ?? 0.7,
      regions,
      pages: [...new Set(regions.map((region) => region.page))],
    };
  });
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function fallbackRegions(pageCount: number, answerCount: number): BoundingBox[][] {
  const boxes: BoundingBox[][] = [];
  const perPage = Math.max(1, Math.ceil(answerCount / Math.max(pageCount, 1)));
  for (let index = 0; index < answerCount; index += 1) {
    const page = Math.min(pageCount, Math.floor(index / perPage) + 1);
    const slot = index % perPage;
    const height = Math.min(0.22, 0.8 / perPage);
    boxes.push([
      {
        page,
        x: 0.08,
        y: 0.1 + slot * (height + 0.04),
        width: 0.84,
        height,
      },
    ]);
  }
  return boxes;
}

export async function runLivePipeline(
  input: ProcessAssessmentInput,
): Promise<AssessmentResult> {
  const questionPages = input.questionPaper.pages ?? [];
  const answerPages = input.answerSheet.pages ?? [];

  if (questionPages.length === 0) {
    throw new Error("No questions could be read from the question paper.");
  }
  if (answerPages.length === 0) {
    throw new Error("No pages could be read from the answer sheet.");
  }

  const questionRaw = await completeJson({
    system:
      "You extract exam questions from a question paper. Treat labelled sub-parts such as 11(a) and 11(b) as separate questions. Preserve original numbering. Return JSON { questions: [{ number, text, maxMarks }] } in printed order.",
    userText:
      "Extract every question and sub-part from these question-paper pages. Do not invent questions.",
    images: questionPages,
  });

  const questions = asQuestions(questionRaw);
  if (questions.length === 0) {
    throw new Error("No questions were detected in the question paper.");
  }

  const answerRaw = await completeJson({
    system:
      "You extract handwritten student answers from an answer sheet. Return JSON { answers: [{ detectedQuestionNumber, text, confidence, regions: [{ page, x, y, width, height }] }] }. Coordinates must be normalized 0–1 relative to each page. If a question number is written, capture it. Keep answers that cannot be matched.",
    userText:
      "Extract every distinct handwritten answer region from these pages, including out-of-order and unmatched answers.",
    images: answerPages,
  });

  let answers = asAnswers(answerRaw);
  if (answers.length === 0) {
    throw new Error("No handwritten answers were detected on the answer sheet.");
  }

  const missingBoxes = answers.some((answer) => answer.regions.length === 0);
  if (missingBoxes) {
    const fallback = fallbackRegions(answerPages.length, answers.length);
    answers = answers.map((answer, index) => ({
      ...answer,
      regions: answer.regions.length > 0 ? answer.regions : fallback[index],
      pages:
        answer.pages.length > 0
          ? answer.pages
          : fallback[index].map((region) => region.page),
    }));
  }

  const mappings = mapAnswers(questions, answers);

  const gradeRaw = await completeJson({
    system:
      "You are an AI teaching assistant. Grade short student answers against the question list. Be conservative. Return JSON { grades: [{ questionNumber, score, maxScore, feedback }] }. Feedback must be short, respectful, and teacher-friendly.",
    userText: JSON.stringify({
      questions: questions.map((question) => ({
        number: question.number,
        text: question.text,
        maxMarks: question.maxMarks,
      })),
      answers: answers.map((answer) => ({
        id: answer.id,
        detectedQuestionNumber: answer.detectedQuestionNumber,
        text: answer.text,
      })),
      mappings,
    }),
    images: [],
  });

  const grades =
    (gradeRaw as {
      grades?: { questionNumber?: string | number; score: number; maxScore?: number; feedback?: string }[];
    }).grades ?? [];
  const lookup: Record<string, { score: number; feedback: string }> = {};
  for (const grade of grades) {
    const question = questions.find(
      (item) => item.normalizedNumber === normalizeQuestionNumber(grade.questionNumber),
    );
    if (!question) continue;
    lookup[question.id] = {
      score: Math.max(0, Math.min(question.maxMarks, Number(grade.score) || 0)),
      feedback: toText(grade.feedback) || "Reviewed by AI-assisted evaluation.",
    };
  }

  const evaluations = applyRubricLookup(questions, mappings, lookup).map((evaluation) => {
    if (!evaluation.feedback && evaluation.questionId && evaluation.status !== "unanswered") {
      return {
        ...evaluation,
        status: gradeFromScore(evaluation.score, evaluation.maxScore),
        feedback: "AI-assisted evaluation did not return detailed feedback for this response.",
      };
    }
    return evaluation;
  });

  const { provider, model } = getConfig();

  return {
    mode: "live",
    provider,
    model,
    questions,
    answers,
    mappings,
    evaluations,
    summary: buildSummary(questions, mappings, evaluations),
    answerSheetPages: answerPages,
    questionPaperPages: questionPages,
  };
}
