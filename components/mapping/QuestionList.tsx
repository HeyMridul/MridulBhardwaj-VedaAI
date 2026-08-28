"use client";

import { QuestionCard } from "@/components/mapping/QuestionCard";
import { useAssessmentStore } from "@/lib/assessment-store";
import { Button } from "@/components/ui/button";
import type { AssessmentResult } from "@/lib/types";

export function QuestionList({ result }: { result: AssessmentResult }) {
  const selectedQuestionId = useAssessmentStore((state) => state.selectedQuestionId);
  const expandedIds = useAssessmentStore((state) => state.expandedIds);
  const selectQuestion = useAssessmentStore((state) => state.selectQuestion);
  const toggleExpanded = useAssessmentStore((state) => state.toggleExpanded);
  const setExpandedAll = useAssessmentStore((state) => state.setExpandedAll);
  const selectUnmatchedAnswer = useAssessmentStore((state) => state.selectUnmatchedAnswer);
  const selectedUnmatchedAnswerId = useAssessmentStore((state) => state.selectedUnmatchedAnswerId);

  const unmatched = result.mappings.filter((mapping) => mapping.status === "unmatched");
  const allExpanded = result.questions.every((question) => expandedIds.includes(question.id));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">
          Extracted Questions <span className="font-normal text-muted-foreground">(from question paper)</span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-coral hover:bg-coral-soft hover:text-coral"
          onClick={() =>
            setExpandedAll(allExpanded ? [] : result.questions.map((question) => question.id))
          }
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {result.questions.map((question) => {
          const mapping = result.mappings.find((item) => item.questionId === question.id);
          const evaluation = result.evaluations.find((item) => item.questionId === question.id);
          return (
            <QuestionCard
              key={question.id}
              question={question}
              mapping={mapping}
              evaluation={evaluation}
              selected={selectedQuestionId === question.id}
              expanded={expandedIds.includes(question.id)}
              onSelect={() => selectQuestion(question.id)}
              onToggle={() => toggleExpanded(question.id)}
            />
          );
        })}

        {unmatched.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-ink">Unmatched answers</h3>
            {unmatched.map((mapping) => {
              const answer = result.answers.find((item) => item.id === mapping.answerId);
              if (!answer) return null;
              const selected = selectedUnmatchedAnswerId === answer.id;
              return (
                <button
                  key={mapping.id}
                  type="button"
                  onClick={() => selectUnmatchedAnswer(answer.id)}
                  className={`mb-2 w-full rounded-2xl border px-4 py-3 text-left ${
                    selected
                      ? "border-amber-400 bg-amber-50"
                      : "border-amber-200 bg-amber-50/60"
                  }`}
                >
                  <p className="text-xs font-semibold tracking-wide text-amber-800 uppercase">
                    Unmatched answer detected
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink">
                    {answer.detectedQuestionNumber
                      ? `Q${answer.detectedQuestionNumber} — ${answer.text}`
                      : answer.text}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
