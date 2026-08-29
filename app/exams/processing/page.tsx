"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ExtractionLoader } from "@/components/processing/ExtractionLoader";
import { useAssessmentStore } from "@/lib/assessment-store";
import { processAssessmentClient, processDemoReview } from "@/lib/pipeline/client";
import { friendlyProcessingError } from "@/lib/pipeline/ai-config";
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
      try {
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
      } catch (error) {
        if (cancelled) return;
        setProcessingError(friendlyProcessingError(error));
      }
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
    })
      .then((response) => {
        if (!response.ok) {
          setProcessingError(response.error);
          return;
        }
        setResult(response.result);
        router.replace("/exams/review");
      })
      .catch((error: unknown) => {
        setProcessingError(friendlyProcessingError(error));
      });
  }

  function openSample() {
    setProcessingError(null);
    setStage("preparing");
    void processDemoReview()
      .then((response) => {
        if (!response.ok) {
          setProcessingError(response.error);
          return;
        }
        setResult(response.result);
        router.replace("/exams/review");
      })
      .catch((error: unknown) => {
        setProcessingError(friendlyProcessingError(error));
      });
  }

  return (
    <AppShell>
      <ExtractionLoader
        stage={stage}
        error={processingError}
        onBack={() => router.push("/exams")}
        onRetry={retry}
        onOpenSample={openSample}
      />
    </AppShell>
  );
}
