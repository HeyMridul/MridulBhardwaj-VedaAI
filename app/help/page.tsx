import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

const STEPS = [
  {
    title: "Upload both files",
    body: "Add a question paper and one student’s answer sheet (PDF or image, max 10MB each).",
  },
  {
    title: "Start mapping",
    body: "VedaAI extracts questions, reads handwritten answers, and maps them even if they are out of order.",
  },
  {
    title: "Review highlights",
    body: "Select a question to jump to the exact region on the answer sheet. Unanswered and unmatched answers stay visible.",
  },
];

export default function HelpPage() {
  return (
    <AppShell>
      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_12px_40px_rgba(40,30,20,0.04)] sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Help</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          VedaAI is the assessment tool inside the AI Teacher&apos;s Toolkit. It maps a printed question paper to a handwritten script.
        </p>

        <ol className="mt-8 max-w-2xl space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold text-coral">Step {index + 1}</p>
              <p className="mt-1 font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/exams"
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
          >
            Go to Exams
          </Link>
          <Link
            href="/notifications"
            className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-semibold"
          >
            Open notifications
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
