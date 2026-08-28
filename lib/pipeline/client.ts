"use client";

import { DEMO_STAGE_SEQUENCE } from "@/lib/demo/dataset";
import { renderDocumentPages } from "@/lib/pdf";
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
    input.questionPaper.pages = await renderDocumentPages(args.questionPaper);
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

  if (!response.ok) {
    return {
      ok: false,
      code: "http-error",
      error: "We couldn't complete extraction. Please try again.",
    };
  }

  return (await response.json()) as ProcessAssessmentResponse;
}
