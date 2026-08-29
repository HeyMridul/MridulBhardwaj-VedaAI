# VedaAI

Teacher-facing assessment tool: upload a printed question paper and a handwritten answer sheet, extract both, map answers to questions (including out-of-order and sub-parts), highlight the exact region on the script, and review AI-assisted marks and feedback.

---

## Submission

| Item | Detail |
| --- | --- |
| **Live deployed URL** | [https://mridulbhardwaj-vedaai.vercel.app/exams](https://mridulbhardwaj-vedaai.vercel.app/exams) |
| **GitHub repository** | [https://github.com/HeyMridul/MridulBhardwaj-VedaAI](https://github.com/HeyMridul/MridulBhardwaj-VedaAI) |
| **AI model / API** | OpenAI-compatible Chat Completions **vision** API. Default: **`gpt-4o-mini`** via `https://api.openai.com/v1`. Swap-in: **Gemini** (`gemini-2.0-flash`) through Google’s OpenAI-compatible endpoint. The key is server-side only (`AI_API_KEY`). |
| **How to review** | Open [the live app](https://mridulbhardwaj-vedaai.vercel.app/exams) → **Load sample documents** → **Start Mapping**. Demo mode needs no API key and walks through a Class 10 Biology script. |

### Approach (brief)

The product is a single Next.js app with a three-step teacher flow: **upload → extract → review**.

1. **Documents** — The browser validates PDF/image uploads (10MB). In live mode, pdf.js renders pages to compact JPEGs on the client so the server never stores files.
2. **Questions** — Printed papers are parsed from PDF text first (free, deterministic). If that is too thin, a text-only model call is used; vision is the last resort.
3. **Answers** — Handwriting still needs vision. The model returns transcript, confidence, and **normalized 0–1 bounding boxes** per page so highlights stay aligned when the viewer resizes.
4. **Mapping** — Deterministic, shared by demo and live (`lib/pipeline/answer-mapper.ts`):
   - match written / detected question numbers (including `11(a)` / `11(b)`);
   - then token overlap + unique-term boost for unnumbered answers;
   - then a single leftover pair can be linked contextually;
   - leftover questions stay **unanswered**; leftover answers stay **unmatched**. Nothing is forced.
5. **Grading** — A short model pass returns score + teacher-facing feedback. If the provider is rate-limited or out of credit, conservative local marks are used so the review screen still opens.
6. **Demo mode** — When `DEMO_MODE=true` or no key is set, the UI uses a fixed Biology fixture (out-of-order Q2, unanswered Q4/Q13, multi-page Q8, semantic Q10, unmatched Q15) so reviewers can exercise the full product without credentials.

```text
Upload → validate → render pages
      → extract questions (text, then model)
      → extract handwritten answers + regions
      → map by number, then semantics
      → grade / feedback
      → review with exact highlights
```

Routes: `/exams` (upload) → `/exams/processing` → `/exams/review`.

### Assumptions

- One student script per run; no class roster, login, or database.
- Question papers are mostly typed (PDF text is usable). Answer sheets are handwritten scans.
- Teachers will review AI marks; scores are assistive, not final.
- A public demo should run with `DEMO_MODE=true` so visitors are not charged and do not need a key.
- Provider keys stay in server env (`.env.local` / Vercel). They are never sent to the browser and must not use a `NEXT_PUBLIC_` prefix.

### Limitations

- Demo mode always reviews the bundled Biology mapping, even if other files were uploaded.
- Live quality depends on scan clarity, page count (first four pages), and remaining provider credit. Empty OpenAI quota cannot be worked around in code.
- Vision boxes can be approximate; unmatched / unanswered rows are kept instead of guessing.
- Session state is in-memory in the tab (Zustand). Refreshing drops the current review.
- No multi-student batching, no persistence, no auth.

---

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui, Zustand, pdf.js, Vitest.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123). Use **Load sample documents**, or drop your own PDF/images.

```bash
npm test
npm run lint
npm run build
```

## Environment

See `.env.example`. Copy it to `.env.local`; do not commit `.env.local`.

| Variable | Purpose |
| --- | --- |
| `DEMO_MODE` | `true` forces the sample Biology review. `false` uses live AI when a key is present. |
| `AI_API_KEY` | Server-side key. Never `NEXT_PUBLIC_*`. |
| `AI_PROVIDER` | Label only (`openai` or `gemini`). |
| `AI_MODEL` | Default `gpt-4o-mini`. |
| `AI_BASE_URL` | OpenAI-compatible base URL. |

## Deploy

Live site: [https://mridulbhardwaj-vedaai.vercel.app/exams](https://mridulbhardwaj-vedaai.vercel.app/exams)

Source: [https://github.com/HeyMridul/MridulBhardwaj-VedaAI](https://github.com/HeyMridul/MridulBhardwaj-VedaAI)

This is a standard Next.js app on Vercel. For a reviewer-safe demo, set `DEMO_MODE=true`. For live extraction of uploaded files, also set `AI_API_KEY` (and optional `AI_PROVIDER` / `AI_MODEL` / `AI_BASE_URL`) in the Vercel project - not in the client.
