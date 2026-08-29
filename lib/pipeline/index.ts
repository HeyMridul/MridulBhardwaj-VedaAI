import { friendlyProcessingError, getAiConfig, isLiveAiConfigured } from "@/lib/pipeline/ai-config";
import { runDemoPipeline } from "@/lib/pipeline/providers/demo";
import { runLivePipeline } from "@/lib/pipeline/providers/openai";
import type { ProcessAssessmentInput, ProcessAssessmentResponse } from "@/lib/types";

export function getPipelineMode(): "demo" | "live" {
  const demoFlag = `${process.env.DEMO_MODE ?? ""}`.trim().toLowerCase();
  if (demoFlag === "true" || demoFlag === "1") return "demo";
  if (getAiConfig().apiKey) return "live";
  if (demoFlag === "false" || demoFlag === "0") return "live";
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
    if (mode === "live" && !getAiConfig().apiKey) {
      return {
        ok: false,
        code: "missing-key",
        error:
          "Live mode is on but no API key was found. Put the key in AI_API_KEY in .env.local (no quotes) and restart npm run dev.",
      };
    }

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
    return {
      ok: false,
      code: "processing-failed",
      error: friendlyProcessingError(error),
    };
  }
}
