"use client";

import { DEMO_STAGE_SEQUENCE } from "@/lib/demo/dataset";
import { extractDocumentText, renderDocumentPages } from "@/lib/pdf";
import type { ProcessAssessmentInput, ProcessAssessmentResponse } from "@/lib/types";

export type PipelineConfig = {
  mode: "demo" | "live";
  provider: string;
};

export async function fetchPipelineConfig(): Promise<PipelineConfig> {
  const response = await fetch("/api/config");
  if (!response.ok) {
    return { mode: "demo", provider: "demo" };
  }
  return (await response.json()) as PipelineConfig;
}

export async function processDemoReview(): Promise<ProcessAssessmentResponse> {
  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      forceDemo: true,
      questionPaper: { name: "demo.pdf", type: "application/pdf", size: 1, pageCount: 1 },
      answerSheet: { name: "demo.pdf", type: "application/pdf", size: 1, pageCount: 1 },
    } satisfies ProcessAssessmentInput),
  });
  const payload = (await response.json().catch(() => null)) as ProcessAssessmentResponse | null;
  if (payload && "ok" in payload) return payload;
  return {
    ok: false,
    code: "http-error",
    error: "We couldn't load the sample review. Please try again.",
  };
}

export async function waitForDemoStages(
  onStage: (stage: string) => void,
): Promise<void> {
  for (const step of DEMO_STAGE_SEQUENCE) {
    onStage(step.stage);
    await new Promise((resolve) => setTimeout(resolve, step.ms));
  }
}

export async function processAssessmentClient(args: {
  questionPaper: File;
  answerSheet: File;
  questionPageCount: number;
  answerPageCount: number;
  onStage: (stage: string) => void;
}): Promise<ProcessAssessmentResponse> {
  try {
    const config = await fetchPipelineConfig();
    args.onStage("uploading");

    const input: ProcessAssessmentInput = {
      questionPaper: {
        name: args.questionPaper.name,
        type: args.questionPaper.type,
        size: args.questionPaper.size,
        pageCount: args.questionPageCount,
      },
      answerSheet: {
        name: args.answerSheet.name,
        type: args.answerSheet.type,
        size: args.answerSheet.size,
        pageCount: args.answerPageCount,
      },
    };

    if (config.mode === "live") {
      args.onStage("reading-questions");
      const [questionPages, printedText] = await Promise.all([
        renderDocumentPages(args.questionPaper),
        extractDocumentText(args.questionPaper),
      ]);
      input.questionPaper.pages = questionPages;
      input.questionPaper.printedText = printedText;
      args.onStage("reading-answers");
      input.answerSheet.pages = await renderDocumentPages(args.answerSheet);
    } else {
      await waitForDemoStages(args.onStage);
    }

    args.onStage("preparing");
    const response = await fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const payload = (await response.json().catch(() => null)) as
      | ProcessAssessmentResponse
      | null;

    if (payload && "ok" in payload) {
      return payload;
    }

    return {
      ok: false,
      code: "http-error",
      error:
        "We couldn't complete extraction. Restart the dev server after saving .env.local, then try again.",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't read those files. Try a smaller PDF or a PNG/JPG scan.";
    return {
      ok: false,
      code: "client-error",
      error: message,
    };
  }
}