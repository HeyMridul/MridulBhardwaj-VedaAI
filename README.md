# VedaAI

Teacher-facing assessment toolkit: upload a question paper and a student’s handwritten answer sheet, extract both, map answers to questions (including out-of-order and sub-parts), highlight the exact answer region, and review AI-assisted scores and feedback.

Live Demo:

## Features

- Question extraction with original numbering and labelled sub-parts (`11(a)` / `11(b)` kept separate)
- Handwritten answer extraction with page, text, confidence, and bounding boxes
- Question–answer mapping that prefers question numbers, then semantic similarity
- Exact answer-region highlighting (normalized coordinates, multi-page regions)
- Out-of-order answers, unanswered questions, and unmatched extra answers
- AI-assisted grading and short teacher-facing feedback
- PDF and image uploads (PDF, PNG, JPG, JPEG, WEBP, 10MB max)
- Desktop sidebar layout and a dedicated mobile tab layout
- Demo mode so the full product can be reviewed without API credentials

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui + Lucide icons
- Zustand for session state
- pdf.js for client-side PDF page rendering
- Vitest for mapping / validation unit tests

## AI Model / API

Live extraction uses an OpenAI-compatible Chat Completions vision API (`gpt-4o-mini` by default). The provider is swappable via `AI_PROVIDER`, `AI_BASE_URL`, and `AI_MODEL`.

The pipeline is deliberately split:

- `DocumentProcessor` / page rendering (`lib/pdf.ts`)
- `QuestionExtractor` + `AnswerExtractor` (`lib/pipeline/providers/openai.ts`)
- `AnswerMapper` (`lib/pipeline/answer-mapper.ts`) — used in both demo and live
- `Grader` (`lib/pipeline/grader.ts`)

If `AI_API_KEY` is missing, or `DEMO_MODE=true`, the app runs **demo processing** on a Class 10 Biology sample. The UI labels this as demo mode and does not pretend a live model was called.

## Architecture

```text
Upload → validate → (demo delay | render pages)
      → extract questions
      → extract handwritten answers + regions
      → map by question number, then semantics
      → grade / feedback
      → review with exact highlights
```

Routes:

- `/exams` upload
- `/exams/processing` extraction
- `/exams/review` mapping + highlighting

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

Use **Load sample documents** on the upload screen, or drop your own PDF/images.

```bash
npm test
npm run lint
npm run build
```

## Environment Variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `DEMO_MODE` | `true` forces demo processing. Omit or `false` to use live AI when a key is present. |
| `AI_API_KEY` | Server-side key for the vision model. Never expose this as `NEXT_PUBLIC_*`. |
| `AI_PROVIDER` | Provider label (`openai` by default). |
| `AI_MODEL` | Model name (`gpt-4o-mini` by default). |
| `AI_BASE_URL` | OpenAI-compatible base URL. |

## Demo Mode

Default when no `AI_API_KEY` is configured. The loader still walks through extraction stages (~3 seconds), then shows a realistic mapped script:

- Q2 is answered after Q3 (out of order)
- Q4 and Q13 are unanswered
- Q8 spans two pages
- Q10 is mapped from answer content (no written number)
- Q15 is kept as an unmatched answer

## Deployment

The app is a standard Next.js project and deploys to Vercel.

1. Push the repository
2. Import the project in Vercel
3. Set environment variables (at minimum `DEMO_MODE=true` for a public demo)
4. Deploy

Do not hardcode localhost URLs. For live grading, set `AI_API_KEY` in the Vercel project, not in the browser.

## Limitations

- Demo mode always reviews the bundled Biology sample mapping, even if you uploaded different files (the banner says so).
- Live vision extraction quality depends on scan clarity and the chosen model.
- Bounding boxes from a vision model can be approximate; the mapper still keeps unmatched/unanswered cases instead of forcing a guess.
- No authentication or database — state lives in the current browser session.
