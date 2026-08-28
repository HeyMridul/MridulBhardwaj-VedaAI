import type {
  Answer,
  DocumentPage,
  Question,
} from "@/lib/types";

export const DEMO_PROVIDER = "demo";
export const DEMO_DELAY_MS = 3200;

export const DEMO_QUESTION_PAGES: DocumentPage[] = [
  { page: 1, src: "/demo/question-paper-page-1.svg" },
  { page: 2, src: "/demo/question-paper-page-2.svg" },
];

export const DEMO_ANSWER_PAGES: DocumentPage[] = [
  { page: 1, src: "/demo/answer-sheet-page-1.svg" },
  { page: 2, src: "/demo/answer-sheet-page-2.svg" },
  { page: 3, src: "/demo/answer-sheet-page-3.svg" },
  { page: 4, src: "/demo/answer-sheet-page-4.svg" },
];

export const DEMO_QUESTIONS: Question[] = [
  {
    id: "q1",
    number: "1",
    normalizedNumber: "1",
    text: "Which blood vessel carries blood away from the heart?",
    maxMarks: 2,
    order: 1,
  },
  {
    id: "q2",
    number: "2",
    normalizedNumber: "2",
    text: "Which of the following organelles is primarily involved in photosynthesis?",
    maxMarks: 2,
    order: 2,
  },
  {
    id: "q3",
    number: "3",
    normalizedNumber: "3",
    text: "Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.",
    maxMarks: 5,
    order: 3,
  },
  {
    id: "q4",
    number: "4",
    normalizedNumber: "4",
    text: "Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta, include the names of the valves crossed.",
    maxMarks: 5,
    order: 4,
  },
  {
    id: "q5",
    number: "5",
    normalizedNumber: "5",
    text: "Draw a labelled diagram of an alveolus showing capillaries and air space (label all exchange).",
    maxMarks: 3,
    order: 5,
  },
  {
    id: "q6",
    number: "6",
    normalizedNumber: "6",
    text: "Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs.",
    maxMarks: 5,
    order: 6,
  },
  {
    id: "q7",
    number: "7",
    normalizedNumber: "7",
    text: "Draw and label a nephron (Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct).",
    maxMarks: 4,
    order: 7,
  },
  {
    id: "q8",
    number: "8",
    normalizedNumber: "8",
    text: "Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf.",
    maxMarks: 3,
    order: 8,
  },
  {
    id: "q9",
    number: "9",
    normalizedNumber: "9",
    text: "Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate.",
    maxMarks: 2,
    order: 9,
  },
  {
    id: "q10",
    number: "10",
    normalizedNumber: "10",
    text: "Explain how the structure of xylem vessels facilitates water transport in plants (mention one adaptation and explain its role).",
    maxMarks: 2,
    order: 10,
  },
  {
    id: "q11a",
    number: "11(a)",
    normalizedNumber: "11a",
    text: "A diagram shows two potted plants — Plant A in bright light with high water needs, Plant B kept in dim light with pale, elongated leaves.",
    maxMarks: 2,
    order: 11,
  },
  {
    id: "q11b",
    number: "11(b)",
    normalizedNumber: "11b",
    text: "Suggest one practical measure to help Plant B recover.",
    maxMarks: 1,
    order: 12,
  },
  {
    id: "q12",
    number: "12",
    normalizedNumber: "12",
    text: "A resting person has tidal volume (air per breath) of 0.5L and breathes 12 times per minute.",
    maxMarks: 2,
    order: 13,
  },
  {
    id: "q13",
    number: "13",
    normalizedNumber: "13",
    text: "If dead space is 0.15L per breath, calculate alveolar ventilation per minute. Show working.",
    maxMarks: 2,
    order: 14,
  },
];

export const DEMO_ANSWERS: Answer[] = [
  {
    id: "a1",
    detectedQuestionNumber: "1",
    text: "The artery / aorta carries oxygenated blood away from the heart. Arteries have thick muscular walls.",
    confidence: 0.98,
    pages: [1],
    regions: [{ page: 1, x: 0.08, y: 0.08, width: 0.84, height: 0.13 }],
  },
  {
    id: "a2",
    detectedQuestionNumber: "3",
    text: "Chloroplasts are the site of photosynthesis. Chlorophyll a and b absorb light. Light-dependent reactions occur in the thylakoid and the Calvin cycle in the stroma.",
    confidence: 0.95,
    pages: [1],
    regions: [{ page: 1, x: 0.08, y: 0.23, width: 0.84, height: 0.26 }],
  },
  {
    id: "a3",
    detectedQuestionNumber: "2",
    text: "Chloroplast.",
    confidence: 0.96,
    pages: [1],
    regions: [{ page: 1, x: 0.08, y: 0.52, width: 0.84, height: 0.13 }],
  },
  {
    id: "a4",
    detectedQuestionNumber: "5",
    text: "Alveolus diagram: air space, capillary, thin epithelium, CO2 out and O2 in.",
    confidence: 0.93,
    pages: [1],
    regions: [{ page: 1, x: 0.08, y: 0.68, width: 0.84, height: 0.26 }],
  },
  {
    id: "a5",
    detectedQuestionNumber: "6",
    text: "Digestive system sketch with stomach, small intestine, large intestine, liver and pancreas. Most absorption labelled at the small intestine / ileum.",
    confidence: 0.87,
    pages: [2],
    regions: [{ page: 2, x: 0.08, y: 0.07, width: 0.84, height: 0.34 }],
  },
  {
    id: "a6",
    detectedQuestionNumber: "7",
    text: "Nephron: Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct.",
    confidence: 0.91,
    pages: [2],
    regions: [{ page: 2, x: 0.08, y: 0.44, width: 0.84, height: 0.28 }],
  },
  {
    id: "a7",
    detectedQuestionNumber: "8",
    text: "Palisade cells are tightly packed and packed with chloroplasts for maximum light absorption. Spongy mesophyll has air spaces for gas diffusion.",
    confidence: 0.91,
    pages: [2, 3],
    regions: [
      { page: 2, x: 0.08, y: 0.75, width: 0.84, height: 0.18 },
      { page: 3, x: 0.08, y: 0.07, width: 0.84, height: 0.16 },
    ],
  },
  {
    id: "a8",
    detectedQuestionNumber: "9",
    text: "Transpiration is the loss of water vapour from leaves through stomata. Wind and high temperature increase the rate.",
    confidence: 0.94,
    pages: [3],
    regions: [{ page: 3, x: 0.08, y: 0.26, width: 0.84, height: 0.16 }],
  },
  {
    id: "a9",
    text: "Xylem vessels are hollow tubes made of dead cells with lignin. This allows a continuous column of water to be pulled up by transpiration with no cytoplasm in the way.",
    confidence: 0.74,
    pages: [3],
    regions: [{ page: 3, x: 0.08, y: 0.45, width: 0.84, height: 0.16 }],
  },
  {
    id: "a10",
    detectedQuestionNumber: "11a",
    text: "Plant B is etiolated because it is growing in dim light. The pale elongated leaves are stretching towards light.",
    confidence: 0.9,
    pages: [3],
    regions: [{ page: 3, x: 0.08, y: 0.64, width: 0.84, height: 0.18 }],
  },
  {
    id: "a11",
    detectedQuestionNumber: "11(b)",
    text: "Move Plant B into brighter light and water it regularly so it can make chlorophyll again.",
    confidence: 0.93,
    pages: [3],
    regions: [{ page: 3, x: 0.08, y: 0.84, width: 0.84, height: 0.1 }],
  },
  {
    id: "a12",
    detectedQuestionNumber: "12",
    text: "Minute ventilation = 0.5 L × 12 = 6 L/min.",
    confidence: 0.97,
    pages: [4],
    regions: [{ page: 4, x: 0.08, y: 0.08, width: 0.84, height: 0.17 }],
  },
  {
    id: "a13",
    detectedQuestionNumber: "15",
    text: "Q15. The mitochondria is the powerhouse of the cell and produces ATP by respiration.",
    confidence: 0.88,
    pages: [4],
    regions: [{ page: 4, x: 0.08, y: 0.3, width: 0.84, height: 0.22 }],
  },
];

export const DEMO_RUBRIC: Record<string, { score: number; feedback: string }> = {
  q1: {
    score: 2,
    feedback:
      "Correct — arteries (specifically the aorta) carry blood away from the heart. A brief note on wall structure is a useful extra.",
  },
  q2: {
    score: 2,
    feedback:
      "Excellent work! You correctly identified the chloroplast as the organelle responsible for photosynthesis. Keep it up!",
  },
  q3: {
    score: 5,
    feedback:
      "Strong explanation covering pigments, thylakoids and the Calvin cycle. This is a complete response for the marks available.",
  },
  q5: {
    score: 3,
    feedback:
      "Clear alveolus sketch with the gas-exchange labels the mark scheme expects.",
  },
  q6: {
    score: 4,
    feedback:
      "Most organs are present and absorption is correctly placed in the small intestine. A neater pancreas/liver placement would secure full marks.",
  },
  q7: {
    score: 4,
    feedback:
      "All six nephron regions are named. The sketch is sufficient for full credit.",
  },
  q8: {
    score: 3,
    feedback:
      "You linked packing and chloroplast density to light capture, and air spaces to gas exchange. Well structured across both pages.",
  },
  q9: {
    score: 2,
    feedback:
      "Accurate definition of transpiration with two valid environmental factors.",
  },
  q10: {
    score: 2,
    feedback:
      "Hollow lignified vessels and the continuous water column are the key adaptations. Mapped from answer content rather than a written question number.",
  },
  q11a: {
    score: 2,
    feedback:
      "Etiolation in dim light is the right interpretation of Plant B.",
  },
  q11b: {
    score: 1,
    feedback: "Moving the plant into brighter light is a practical, mark-worthy recovery step.",
  },
  q12: {
    score: 2,
    feedback: "Minute ventilation is calculated correctly: 0.5 × 12 = 6 L/min.",
  },
};

export const DEMO_STAGE_SEQUENCE = [
  { stage: "uploading" as const, ms: 350 },
  { stage: "reading-questions" as const, ms: 400 },
  { stage: "extracting-questions" as const, ms: 450 },
  { stage: "reading-answers" as const, ms: 400 },
  { stage: "detecting-answers" as const, ms: 500 },
  { stage: "mapping" as const, ms: 450 },
  { stage: "grading" as const, ms: 400 },
  { stage: "preparing" as const, ms: 250 },
];
