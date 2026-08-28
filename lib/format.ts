export function formatScore(score: number, maxScore: number): string {
  return `${score}/${maxScore}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function confidenceLabel(
  confidence: number,
): "high" | "medium" | "low" {
  if (confidence >= 0.85) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
}

export function stageLabel(stage: string): string {
  switch (stage) {
    case "uploading":
      return "Uploading documents";
    case "reading-questions":
      return "Reading question paper";
    case "extracting-questions":
      return "Extracting questions";
    case "reading-answers":
      return "Reading answer sheet";
    case "detecting-answers":
      return "Detecting handwritten answers";
    case "mapping":
      return "Mapping answers to questions";
    case "grading":
      return "Generating grading and feedback";
    case "preparing":
      return "Preparing review";
    case "error":
      return "Extraction failed";
    default:
      return "Extracting";
  }
}
