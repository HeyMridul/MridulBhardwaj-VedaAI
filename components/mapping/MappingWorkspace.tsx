"use client";

import { useMemo } from "react";
import { AnswerViewer } from "@/components/mapping/AnswerViewer";
import { AssessmentSummary } from "@/components/mapping/AssessmentSummary";
import { QuestionList } from "@/components/mapping/QuestionList";
import { selectMappedAnswer, useAssessmentStore } from "@/lib/assessment-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssessmentResult } from "@/lib/types";

export function MappingWorkspace({ result }: { result: AssessmentResult }) {
  const selectedQuestionId = useAssessmentStore((state) => state.selectedQuestionId);
  const selectedUnmatchedAnswerId = useAssessmentStore((state) => state.selectedUnmatchedAnswerId);
  const mobileTab = useAssessmentStore((state) => state.mobileTab);
  const setMobileTab = useAssessmentStore((state) => state.setMobileTab);

  const { mapping, answer, question } = selectMappedAnswer(result, selectedQuestionId);
  const unmatchedAnswer = result.answers.find((item) => item.id === selectedUnmatchedAnswerId);

  const regions = unmatchedAnswer?.regions ?? answer?.regions ?? [];
  const evaluation = result.evaluations.find(
    (item) =>
      item.questionId === selectedQuestionId || item.answerId === selectedUnmatchedAnswerId,
  );

  const emptyMessage = useMemo(() => {
    if (unmatchedAnswer) {
      return "Unmatched answer detected — this response is not in the question paper.";
    }
    if (!question) return undefined;
    if (mapping?.status === "unanswered") {
      return "No answer was detected for this question.";
    }
    if (!answer) return "No answer was detected for this question.";
    return undefined;
  }, [answer, mapping, question, unmatchedAnswer]);

  const hideHighlight =
    !unmatchedAnswer && (!answer || mapping?.status === "unanswered");

  function renderViewer() {
    return (
      <AnswerViewer
        key={`${selectedQuestionId ?? "none"}-${selectedUnmatchedAnswerId ?? "none"}`}
        pages={result.answerSheetPages}
        regions={hideHighlight ? [] : regions}
        evaluationStatus={unmatchedAnswer ? "unmatched" : evaluation?.status}
        emptyMessage={emptyMessage}
      />
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col">
      {result.mode === "demo" && (
        <p className="mb-3 rounded-xl bg-coral-soft px-3 py-2 text-sm text-ink/80">
          Demo mode — sample Class 10 Biology extraction, mapping and highlighting. Add an{" "}
          <code className="rounded bg-white px-1">AI_API_KEY</code> to process your own files live.
        </p>
      )}
      <AssessmentSummary result={result} />

      <div className="hidden min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-[minmax(320px,42%)_1fr]">
        <div className="min-h-0 rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(40,30,20,0.04)]">
          <QuestionList result={result} />
        </div>
        <div className="min-h-0 rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(40,30,20,0.04)]">
          {renderViewer()}
        </div>
      </div>

      <Tabs
        value={mobileTab}
        onValueChange={(value) => setMobileTab(value as "questions" | "answers")}
        className="flex min-h-0 flex-1 lg:hidden"
      >
        <TabsList className="mb-3 w-full rounded-full bg-white p-1">
          <TabsTrigger value="questions" className="flex-1 rounded-full">
            Questions
          </TabsTrigger>
          <TabsTrigger value="answers" className="flex-1 rounded-full">
            Answer Sheet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="questions" keepMounted className="min-h-0 overflow-hidden rounded-[24px] bg-white p-3">
          <QuestionList result={result} />
        </TabsContent>
        <TabsContent value="answers" keepMounted className="min-h-0 overflow-hidden rounded-[24px] bg-white p-3">
          {renderViewer()}
        </TabsContent>
      </Tabs>
    </section>
  );
}
