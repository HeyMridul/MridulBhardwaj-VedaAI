"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { confidenceLabel, formatPercent, formatScore } from "@/lib/format";
import type { Evaluation, Mapping, Question } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  question: Question;
  mapping?: Mapping;
  evaluation?: Evaluation;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
};

export function QuestionCard({
  question,
  mapping,
  evaluation,
  selected,
  expanded,
  onSelect,
  onToggle,
}: Props) {
  const status = evaluation?.status ?? (mapping?.status === "unanswered" ? "unanswered" : "incorrect");
  const scoreLabel =
    status === "unanswered"
      ? "Not answered"
      : formatScore(evaluation?.score ?? 0, evaluation?.maxScore ?? question.maxMarks);
  const confidence = mapping?.confidence ?? 1;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(40,30,20,0.03)] transition-all",
        selected
          ? "border-coral shadow-[0_8px_24px_rgba(232,93,58,0.08)] ring-0 border-l-[3px]"
          : "border-transparent hover:border-border",
        status === "unanswered" && !selected && "bg-[#faf8f4]",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 text-left"
          aria-pressed={selected}
        >
          <div className="flex items-start gap-3">
            <span className="w-8 shrink-0 pt-0.5 text-sm font-semibold text-muted-foreground">
              {question.number}
            </span>
            <p
              className={cn(
                "text-[15px] leading-snug text-ink",
                !expanded && "line-clamp-2",
              )}
            >
              {question.text}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <ScoreBadge status={status} label={scoreLabel} />
          <button
            type="button"
            aria-label={expanded ? "Collapse question" : "Expand question"}
            aria-expanded={expanded}
            onClick={onToggle}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-ink"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 ml-11 space-y-3">
          <p className="text-sm leading-relaxed text-ink/90">{question.text}</p>
          {evaluation?.feedback && (
            <div className="rounded-xl bg-[#f6f3ee] px-3.5 py-3">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                AI Feedback
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink/85">{evaluation.feedback}</p>
            </div>
          )}
          {mapping && mapping.status !== "unanswered" && (
            <p className="text-xs text-muted-foreground">
              Mapping {confidenceLabel(confidence)} · {formatPercent(confidence)} ·{" "}
              {mapping.method === "question-number"
                ? "matched by question number"
                : mapping.method === "semantic"
                  ? "matched by answer content"
                  : mapping.method === "contextual"
                    ? "matched from nearby answers"
                    : "unmatched"}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function ScoreBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "correct" && "bg-emerald-50 text-success",
        status === "partial" && "bg-coral-soft text-coral",
        status === "incorrect" && "bg-red-50 text-destructive",
        status === "unanswered" && "bg-[#eeeae3] text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}
