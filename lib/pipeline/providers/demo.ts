import {
  DEMO_ANSWER_PAGES,
  DEMO_ANSWERS,
  DEMO_PROVIDER,
  DEMO_QUESTION_PAGES,
  DEMO_QUESTIONS,
  DEMO_RUBRIC,
} from "@/lib/demo/dataset";
import { mapAnswers } from "@/lib/pipeline/answer-mapper";
import { applyRubricLookup } from "@/lib/pipeline/grader";
import { buildSummary } from "@/lib/pipeline/summary";
import type { AssessmentResult, ProcessAssessmentInput } from "@/lib/types";

export function runDemoPipeline(input: ProcessAssessmentInput): AssessmentResult {
  void input;
  const questions = DEMO_QUESTIONS;
  const answers = DEMO_ANSWERS;
  const mappings = mapAnswers(questions, answers);
  const evaluations = applyRubricLookup(questions, mappings, DEMO_RUBRIC);

  return {
    mode: "demo",
    provider: DEMO_PROVIDER,
    questions,
    answers,
    mappings,
    evaluations,
    summary: buildSummary(questions, mappings, evaluations),
    answerSheetPages: DEMO_ANSWER_PAGES,
    questionPaperPages: DEMO_QUESTION_PAGES,
  };
}
