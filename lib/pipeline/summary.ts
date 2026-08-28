import type { AssessmentSummary, Evaluation, Mapping, Question } from "@/lib/types";
import { averageMappingConfidence } from "@/lib/pipeline/answer-mapper";

export function buildSummary(
  questions: Question[],
  mappings: Mapping[],
  evaluations: Evaluation[],
): AssessmentSummary {
  const unanswered = mappings.filter((mapping) => mapping.status === "unanswered").length;
  const unmatched = mappings.filter((mapping) => mapping.status === "unmatched").length;
  const answered = questions.length - unanswered;
  const score = evaluations
    .filter((evaluation) => evaluation.questionId)
    .reduce((sum, evaluation) => sum + evaluation.score, 0);
  const maxScore = questions.reduce((sum, question) => sum + question.maxMarks, 0);

  return {
    score,
    maxScore,
    answered,
    totalQuestions: questions.length,
    unanswered,
    unmatched,
    mappingConfidence: averageMappingConfidence(mappings),
  };
}
