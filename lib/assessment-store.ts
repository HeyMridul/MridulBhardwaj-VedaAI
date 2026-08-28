"use client";

import { create } from "zustand";
import { inspectDocumentPages } from "@/lib/pdf";
import { validateUpload } from "@/lib/file-validation";
import type {
  Answer,
  AssessmentResult,
  Mapping,
  ProcessingStage,
  Question,
  UploadedDocument,
} from "@/lib/types";

type UploadSlot = "questionPaper" | "answerSheet";

type AssessmentStore = {
  questionPaper: UploadedDocument | null;
  answerSheet: UploadedDocument | null;
  uploadError: Partial<Record<UploadSlot, string>>;
  stage: ProcessingStage;
  processingError: string | null;
  result: AssessmentResult | null;
  selectedQuestionId: string | null;
  selectedUnmatchedAnswerId: string | null;
  expandedIds: string[];
  mobileTab: "questions" | "answers";
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  setUpload: (slot: UploadSlot, file: File) => Promise<string | null>;
  clearUpload: (slot: UploadSlot) => void;
  clearUploadError: (slot: UploadSlot) => void;
  loadSampleDocuments: () => Promise<void>;
  setStage: (stage: ProcessingStage) => void;
  setProcessingError: (error: string | null) => void;
  setResult: (result: AssessmentResult) => void;
  selectQuestion: (id: string | null) => void;
  selectUnmatchedAnswer: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  setExpandedAll: (ids: string[]) => void;
  setMobileTab: (tab: "questions" | "answers") => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  resetProcessing: () => void;
  resetAll: () => void;
};

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function fileFromUrl(url: string, name: string, type: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Sample documents could not be loaded.");
  }
  const blob = await response.blob();
  return new File([blob], name, { type });
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  questionPaper: null,
  answerSheet: null,
  uploadError: {},
  stage: "idle",
  processingError: null,
  result: null,
  selectedQuestionId: null,
  selectedUnmatchedAnswerId: null,
  expandedIds: [],
  mobileTab: "questions",
  sidebarCollapsed: false,
  mobileNavOpen: false,

  async setUpload(slot, file) {
    const validation = validateUpload(file);
    if (!validation.ok) {
      set((state) => ({
        uploadError: { ...state.uploadError, [slot]: validation.message },
      }));
      return validation.message;
    }

    let pageCount: number | null = null;
    try {
      pageCount = await inspectDocumentPages(file);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't read that document.";
      set((state) => ({
        uploadError: { ...state.uploadError, [slot]: message },
      }));
      return message;
    }

    const document: UploadedDocument = {
      id: nextId(),
      name: file.name,
      size: file.size,
      type: file.type || inferType(file.name),
      pageCount,
      file,
    };

    set((state) => ({
      [slot]: document,
      uploadError: { ...state.uploadError, [slot]: undefined },
      result: null,
      processingError: null,
      stage: "idle",
    }));
    return null;
  },

  clearUpload(slot) {
    set((state) => ({
      [slot]: null,
      uploadError: { ...state.uploadError, [slot]: undefined },
      result: null,
      stage: "idle",
    }));
  },

  clearUploadError(slot) {
    set((state) => ({
      uploadError: { ...state.uploadError, [slot]: undefined },
    }));
  },

  async loadSampleDocuments() {
    const [question, answer] = await Promise.all([
      fileFromUrl(
        "/demo/Class_10_biology_unit_test.pdf",
        "Class_10_biology_unit_test.pdf",
        "application/pdf",
      ),
      fileFromUrl(
        "/demo/student_1_answer_sheet.pdf",
        "student_1_answer_sheet.pdf",
        "application/pdf",
      ),
    ]);
    await get().setUpload("questionPaper", question);
    await get().setUpload("answerSheet", answer);
  },

  setStage(stage) {
    set({ stage, processingError: stage === "error" ? get().processingError : null });
  },

  setProcessingError(error) {
    set({ processingError: error, stage: error ? "error" : get().stage });
  },

  setResult(result) {
    const firstId = result.questions[0]?.id ?? null;
    set({
      result,
      stage: "complete",
      processingError: null,
      selectedQuestionId: firstId,
      selectedUnmatchedAnswerId: null,
      expandedIds: firstId ? [firstId] : [],
      mobileTab: "questions",
    });
  },

  selectQuestion(id) {
    set((state) => ({
      selectedQuestionId: id,
      selectedUnmatchedAnswerId: null,
      expandedIds:
        id && !state.expandedIds.includes(id)
          ? [...state.expandedIds, id]
          : state.expandedIds,
      mobileTab: "answers",
    }));
  },

  selectUnmatchedAnswer(id) {
    set({
      selectedUnmatchedAnswerId: id,
      selectedQuestionId: null,
      mobileTab: "answers",
    });
  },

  toggleExpanded(id) {
    set((state) => ({
      expandedIds: state.expandedIds.includes(id)
        ? state.expandedIds.filter((item) => item !== id)
        : [...state.expandedIds, id],
    }));
  },

  setExpandedAll(ids) {
    set({ expandedIds: ids });
  },

  setMobileTab(tab) {
    set({ mobileTab: tab });
  },

  toggleSidebar() {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setMobileNavOpen(open) {
    set({ mobileNavOpen: open });
  },

  resetProcessing() {
    set({
      stage: "idle",
      processingError: null,
      result: null,
      selectedQuestionId: null,
      selectedUnmatchedAnswerId: null,
      expandedIds: [],
    });
  },

  resetAll() {
    set({
      questionPaper: null,
      answerSheet: null,
      uploadError: {},
      stage: "idle",
      processingError: null,
      result: null,
      selectedQuestionId: null,
      selectedUnmatchedAnswerId: null,
      expandedIds: [],
      mobileTab: "questions",
    });
  },
}));

function inferType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

export function selectMappedAnswer(
  result: AssessmentResult | null,
  questionId: string | null,
): { mapping: Mapping | null; answer: Answer | null; question: Question | null } {
  if (!result || !questionId) {
    return { mapping: null, answer: null, question: null };
  }
  const question = result.questions.find((item) => item.id === questionId) ?? null;
  const mapping =
    result.mappings.find((item) => item.questionId === questionId) ?? null;
  const answer = mapping?.answerId
    ? result.answers.find((item) => item.id === mapping.answerId) ?? null
    : null;
  return { mapping, answer, question };
}
