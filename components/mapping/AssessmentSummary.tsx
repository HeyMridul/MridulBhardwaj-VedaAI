import { formatPercent, formatScore } from "@/lib/format";
import type { AssessmentResult } from "@/lib/types";

export function AssessmentSummary({ result }: { result: AssessmentResult }) {
  const { summary } = result;
  return (
    <section className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-white p-3 sm:grid-cols-4">
      <Stat label="Score" value={formatScore(summary.score, summary.maxScore)} />
      <Stat label="Answered" value={`${summary.answered} / ${summary.totalQuestions}`} />
      <Stat label="Unanswered" value={String(summary.unanswered)} />
      <Stat label="Mapping confidence" value={formatPercent(summary.mappingConfidence)} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
