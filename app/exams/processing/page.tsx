"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ExtractionLoader } from "@/components/processing/ExtractionLoader";
import { useAssessmentStore } from "@/lib/assessment-store";
import { processAssessmentClient } from "@/lib/pipeline/client";
import type { ProcessingStage } from "@/lib/types";

export default function ProcessingPage() {
  const router = useRouter();
  const questionPaper = useAssessmentStore((state) => state.questionPaper);
  const answerSheet = useAssessmentStore((state) => state.answerSheet);
  const stage = useAssessmentStore((state) => state.stage);
  const processingError = useAssessmentStore((state) => state.processingError);
  const setStage = useAssessmentStore((state) => state.setStage);
  const setResult = useAssessmentStore((state) => state.setResult);
  const setProcessingError = useAssessmentStore((state) => state.setProcessingError);

  useEffect(() => {
    if (!questionPaper || !answerSheet) {
      router.replace("/exams");
      return;
    }

    let cancelled = false;

    async function run() {
      setProcessingError(null);
      setStage("uploading");
      const response = await processAssessmentClient({
        questionPaper: questionPaper!.file,
        answerSheet: answerSheet!.file,
        questionPageCount: questionPaper!.pageCount ?? 1,
        answerPageCount: answerSheet!.pageCount ?? 1,
        onStage: (next) => {
          if (!cancelled) setStage(next as ProcessingStage);
        },
      });
      if (cancelled) return;
      if (!response.ok) {
        setProcessingError(response.error);
        return;
      }
      setResult(response.result);
      router.replace("/exams/review");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    answerSheet,
    questionPaper,
    router,
    setProcessingError,
    setResult,
    setStage,
  ]);

  function retry() {
    if (!questionPaper || !answerSheet) return;
    setProcessingError(null);
    setStage("uploading");
    void processAssessmentClient({
      questionPaper: questionPaper.file,
      answerSheet: answerSheet.file,
      questionPageCount: questionPaper.pageCount ?? 1,
      answerPageCount: answerSheet.pageCount ?? 1,
      onStage: (next) => setStage(next as ProcessingStage),
    }).then((response) => {
      if (!response.ok) {
        setProcessingError(response.error);
        return;
      }
      setResult(response.result);
      router.replace("/exams/review");
    });
  }

  return (
    <AppShell>
      <ExtractionLoader
        stage={stage}
        error={processingError}
        onBack={() => router.push("/exams")}
        onRetry={retry}
      />
    </AppShell>
  );
}
