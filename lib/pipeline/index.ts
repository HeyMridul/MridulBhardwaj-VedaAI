import { runDemoPipeline } from "@/lib/pipeline/providers/demo";
import {
  isLiveAiConfigured,
  runLivePipeline,
} from "@/lib/pipeline/providers/openai";
import type { ProcessAssessmentInput, ProcessAssessmentResponse } from "@/lib/types";

export function getPipelineMode(): "demo" | "live" {
  return isLiveAiConfigured() ? "live" : "demo";
}

export async function processAssessment(
  input: ProcessAssessmentInput,
): Promise<ProcessAssessmentResponse> {
  try {
    if (!input.questionPaper) {
      return {
        ok: false,
        code: "missing-question-paper",
        error: "Upload a question paper to continue.",
      };
    }
    if (!input.answerSheet) {
      return {
        ok: false,
        code: "missing-answer-sheet",
        error: "Upload an answer sheet to continue.",
      };
    }

    const mode = getPipelineMode();
    const result =
      mode === "live" ? await runLivePipeline(input) : runDemoPipeline(input);

    if (result.questions.length === 0) {
      return {
        ok: false,
        code: "no-questions",
        error: "No questions were detected in the question paper.",
      };
    }

    return { ok: true, result };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't complete extraction. Please try again.";
    return {
      ok: false,
      code: "processing-failed",
      error: message,
    };
  }
}
