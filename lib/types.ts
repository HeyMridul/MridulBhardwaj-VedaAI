export type BoundingBox = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DocumentPage = {
  page: number;
  src: string;
  width?: number;
  height?: number;
};

export type UploadedDocument = {
  id: string;
  name: string;
  size: number;
  type: string;
  pageCount: number | null;
  file: File;
};

export type Question = {
  id: string;
  number: string;
  normalizedNumber: string;
  text: string;
  maxMarks: number;
  order: number;
};

export type Answer = {
  id: string;
  detectedQuestionNumber?: string;
  text: string;
  regions: BoundingBox[];
  pages: number[];
  confidence: number;
};

export type MappingStatus = "mapped" | "unanswered" | "unmatched" | "uncertain";

export type Mapping = {
  id: string;
  questionId?: string;
  answerId?: string;
  confidence: number;
  status: MappingStatus;
  method: "question-number" | "semantic" | "contextual" | "none";
};

export type EvaluationStatus =
  | "correct"
  | "partial"
  | "incorrect"
  | "unanswered"
  | "unmatched";

export type Evaluation = {
  questionId?: string;
  answerId?: string;
  score: number;
  maxScore: number;
  status: EvaluationStatus;
  feedback?: string;
};

export type AssessmentSummary = {
  score: number;
  maxScore: number;
  answered: number;
  totalQuestions: number;
  unanswered: number;
  unmatched: number;
  mappingConfidence: number;
};

export type ProcessingStage =
  | "idle"
  | "uploading"
  | "reading-questions"
  | "extracting-questions"
  | "reading-answers"
  | "detecting-answers"
  | "mapping"
  | "grading"
  | "preparing"
  | "complete"
  | "error";

export type PipelineMode = "demo" | "live";

export type AssessmentResult = {
  mode: PipelineMode;
  provider: string;
  model?: string;
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
  evaluations: Evaluation[];
  summary: AssessmentSummary;
  answerSheetPages: DocumentPage[];
  questionPaperPages: DocumentPage[];
};

export type ProcessAssessmentInput = {
  forceDemo?: boolean;
  questionPaper: {
    name: string;
    type: string;
    size: number;
    pageCount: number;
    pages?: DocumentPage[];
    printedText?: string;
  };
  answerSheet: {
    name: string;
    type: string;
    size: number;
    pageCount: number;
    pages?: DocumentPage[];
  };
};

export type ProcessAssessmentResponse =
  | { ok: true; result: AssessmentResult }
  | { ok: false; error: string; code: string };
