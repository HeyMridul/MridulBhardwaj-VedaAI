import type { Answer, Evaluation, Mapping, Question } from "@/lib/types";

export function unansweredEvaluation(question: Question): Evaluation {
  return {
    questionId: question.id,
    score: 0,
    maxScore: question.maxMarks,
    status: "unanswered",
    feedback:
      "No answer was detected for this question. The student appears to have skipped it.",
  };
}

export function unmatchedEvaluation(answerId: string): Evaluation {
  return {
    answerId,
    score: 0,
    maxScore: 0,
    status: "unmatched",
    feedback:
      "This handwritten response could not be matched to a question in the paper.",
  };
}

export function gradeFromScore(
  score: number,
  maxScore: number,
): Evaluation["status"] {
  if (score <= 0) return "incorrect";
  if (score >= maxScore) return "correct";
  return "partial";
}

export function applyRubricLookup(
  questions: Question[],
  mappings: Mapping[],
  lookup: Record<string, { score: number; feedback: string }>,
): Evaluation[] {
  const evaluations: Evaluation[] = [];

  for (const mapping of mappings) {
    if (mapping.status === "unmatched" && mapping.answerId) {
      evaluations.push(unmatchedEvaluation(mapping.answerId));
      continue;
    }

    if (!mapping.questionId) continue;
    const question = questions.find((item) => item.id === mapping.questionId);
    if (!question) continue;

    if (mapping.status === "unanswered") {
      evaluations.push(unansweredEvaluation(question));
      continue;
    }

    const rubric = lookup[question.id];
    const score = rubric?.score ?? 0;
    evaluations.push({
      questionId: question.id,
      answerId: mapping.answerId,
      score,
      maxScore: question.maxMarks,
      status: gradeFromScore(score, question.maxMarks),
      feedback: rubric?.feedback,
    });
  }

  return evaluations;
}

export function heuristicLookup(
  questions: Question[],
  mappings: Mapping[],
  answers: Answer[],
): Record<string, { score: number; feedback: string }> {
  const byId = new Map(answers.map((answer) => [answer.id, answer]));
  const lookup: Record<string, { score: number; feedback: string }> = {};

  for (const mapping of mappings) {
    if (!mapping.questionId) continue;
    if (mapping.status === "unanswered" || mapping.status === "unmatched") continue;
    const question = questions.find((item) => item.id === mapping.questionId);
    const answer = mapping.answerId ? byId.get(mapping.answerId) : undefined;
    if (!question || !answer) continue;

    const words = answer.text.trim().split(/\s+/).filter(Boolean).length;
    if (words < 4) {
      lookup[question.id] = {
        score: 0,
        feedback: "Very short response. Review this before awarding marks.",
      };
      continue;
    }

    lookup[question.id] = {
      score: Math.min(question.maxMarks, Math.max(1, Math.round(question.maxMarks * 0.5))),
      feedback:
        "Conservative estimate — model grading was skipped to save API credit. Please review this mark.",
    };
  }

  return lookup;
}
