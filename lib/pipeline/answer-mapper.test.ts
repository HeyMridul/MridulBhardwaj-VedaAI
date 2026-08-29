import { describe, expect, it } from "vitest";
import { mapAnswers } from "@/lib/pipeline/answer-mapper";
import { DEMO_ANSWERS, DEMO_QUESTIONS, DEMO_RUBRIC } from "@/lib/demo/dataset";
import { applyRubricLookup } from "@/lib/pipeline/grader";
import { buildSummary } from "@/lib/pipeline/summary";
import type { Answer, Question } from "@/lib/types";

describe("mapAnswers", () => {
  it("maps out-of-order answers by question number, not page order", () => {
    const questions: Question[] = [
      { id: "q1", number: "1", normalizedNumber: "1", text: "Q1", maxMarks: 2, order: 1 },
      { id: "q2", number: "2", normalizedNumber: "2", text: "Q2", maxMarks: 2, order: 2 },
      { id: "q3", number: "3", normalizedNumber: "3", text: "Q3", maxMarks: 2, order: 3 },
      { id: "q4", number: "4", normalizedNumber: "4", text: "Q4", maxMarks: 2, order: 4 },
    ];
    const answers: Answer[] = [
      {
        id: "a1",
        detectedQuestionNumber: "1",
        text: "answer 1",
        confidence: 0.9,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.1, width: 0.8, height: 0.1 }],
      },
      {
        id: "a2",
        detectedQuestionNumber: "4",
        text: "answer 4",
        confidence: 0.9,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.3, width: 0.8, height: 0.1 }],
      },
      {
        id: "a3",
        detectedQuestionNumber: "2",
        text: "answer 2",
        confidence: 0.9,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.5, width: 0.8, height: 0.1 }],
      },
    ];

    const mappings = mapAnswers(questions, answers);
    const byQuestion = Object.fromEntries(
      mappings
        .filter((mapping) => mapping.questionId)
        .map((mapping) => [mapping.questionId, mapping]),
    );

    expect(byQuestion.q1.answerId).toBe("a1");
    expect(byQuestion.q2.answerId).toBe("a3");
    expect(byQuestion.q4.answerId).toBe("a2");
    expect(byQuestion.q3.status).toBe("unanswered");
  });

  it("keeps labelled sub-parts as separate questions", () => {
    const questions: Question[] = [
      { id: "q11a", number: "11(a)", normalizedNumber: "11a", text: "Plant A", maxMarks: 2, order: 1 },
      { id: "q11b", number: "11(b)", normalizedNumber: "11b", text: "Plant B recover", maxMarks: 1, order: 2 },
    ];
    const answers: Answer[] = [
      {
        id: "a1",
        detectedQuestionNumber: "11 a",
        text: "etiolated",
        confidence: 0.9,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.1, width: 0.8, height: 0.1 }],
      },
      {
        id: "a2",
        detectedQuestionNumber: "11(b)",
        text: "move to light",
        confidence: 0.9,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.3, width: 0.8, height: 0.1 }],
      },
    ];

    const mappings = mapAnswers(questions, answers);
    expect(mappings.find((mapping) => mapping.questionId === "q11a")?.answerId).toBe("a1");
    expect(mappings.find((mapping) => mapping.questionId === "q11b")?.answerId).toBe("a2");
  });

  it("marks unknown question numbers as unmatched", () => {
    const questions: Question[] = [
      { id: "q1", number: "1", normalizedNumber: "1", text: "Q1", maxMarks: 2, order: 1 },
    ];
    const answers: Answer[] = [
      {
        id: "a15",
        detectedQuestionNumber: "15",
        text: "mitochondria",
        confidence: 0.9,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.1, width: 0.8, height: 0.2 }],
      },
    ];

    const mappings = mapAnswers(questions, answers);
    expect(mappings.find((mapping) => mapping.answerId === "a15")?.status).toBe("unmatched");
    expect(mappings.find((mapping) => mapping.questionId === "q1")?.status).toBe("unanswered");
  });

  it("falls back to semantic similarity when no number is detected", () => {
    const questions: Question[] = [
      {
        id: "q10",
        number: "10",
        normalizedNumber: "10",
        text: "Explain how the structure of xylem vessels facilitates water transport in plants",
        maxMarks: 2,
        order: 1,
      },
      {
        id: "q2",
        number: "2",
        normalizedNumber: "2",
        text: "Which organelle is involved in photosynthesis?",
        maxMarks: 2,
        order: 2,
      },
    ];
    const answers: Answer[] = [
      {
        id: "ax",
        text: "Xylem vessels are hollow lignified tubes that carry a continuous water column",
        confidence: 0.7,
        pages: [1],
        regions: [{ page: 1, x: 0.1, y: 0.1, width: 0.8, height: 0.2 }],
      },
    ];

    const mappings = mapAnswers(questions, answers);
    expect(mappings.find((mapping) => mapping.questionId === "q10")?.answerId).toBe("ax");
    expect(mappings.find((mapping) => mapping.questionId === "q10")?.method).toBe("semantic");
    expect(mappings.find((mapping) => mapping.questionId === "q2")?.status).toBe("unanswered");
  });

  it("maps the bundled demo dataset to 32/40 with unanswered and unmatched cases", () => {
    const mappings = mapAnswers(DEMO_QUESTIONS, DEMO_ANSWERS);
    const evaluations = applyRubricLookup(DEMO_QUESTIONS, mappings, DEMO_RUBRIC);
    const summary = buildSummary(DEMO_QUESTIONS, mappings, evaluations);

    expect(mappings.find((mapping) => mapping.questionId === "q2")?.answerId).toBe("a3");
    expect(mappings.find((mapping) => mapping.questionId === "q3")?.answerId).toBe("a2");
    expect(mappings.find((mapping) => mapping.questionId === "q4")?.status).toBe("unanswered");
    expect(mappings.find((mapping) => mapping.questionId === "q13")?.status).toBe("unanswered");
    expect(mappings.find((mapping) => mapping.answerId === "a13")?.status).toBe("unmatched");
    expect(mappings.find((mapping) => mapping.questionId === "q10")?.method).toBe("semantic");
    expect(summary.score).toBe(32);
    expect(summary.maxScore).toBe(40);
    expect(summary.unanswered).toBe(2);
    expect(summary.unmatched).toBe(1);
  });
});
