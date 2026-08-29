"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { stageLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";

const GEMINI_ENV_SNIPPET = `DEMO_MODE=false
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
# Get a Gemini key at https://aistudio.google.com/apikey
# Put the key in .env.local (no quotes) and restart npm run dev:
AI_API_KEY=YOUR_GEMINI_KEY_IN_ENV_LOCAL`;

type Props = {
  stage: string;
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
  onOpenSample?: () => void;
};

export function ExtractionLoader({ stage, error, onRetry, onBack, onOpenSample }: Props) {
  if (error) {
    const quota = /no remaining credit|insufficient_quota|quota|billing/i.test(error);
    return (
      <section className="flex flex-1 items-center justify-center rounded-[28px] bg-white px-6 py-10 shadow-[0_12px_40px_rgba(40,30,20,0.04)]">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-coral-soft text-coral">
            <Sparkles className="size-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            We couldn&apos;t complete extraction
          </h1>
          <p className="mt-2 text-muted-foreground">{error}</p>

          {quota ? (
            <div className="mt-5 rounded-2xl border border-border bg-[#fbf8f3] p-4 text-left text-sm text-ink">
              <p className="font-semibold">OpenAI will keep failing until this key has credit.</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  Add billing at{" "}
                  <a
                    className="font-medium text-coral underline-offset-4 hover:underline"
                    href="https://platform.openai.com/settings/organization/billing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    platform.openai.com
                  </a>
                  , then retry.
                </li>
                <li>
                  Or put a Gemini key in <code className="text-ink">.env.local</code> (free tier), then restart{" "}
                  <code className="text-ink">npm run dev</code>:
                </li>
              </ol>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-ink px-3 py-3 text-left text-[11px] leading-5 text-white">
                {GEMINI_ENV_SNIPPET}
              </pre>
              <p className="mt-2 text-xs text-muted-foreground">
                Get a Gemini key at{" "}
                <a
                  className="text-coral underline-offset-4 hover:underline"
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                >
                  aistudio.google.com/apikey
                </a>
                . Same block is also on{" "}
                <Link href="/settings" className="text-coral underline-offset-4 hover:underline">
                  Settings
                </Link>
                .
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="rounded-full" onClick={onBack}>
              Back to upload
            </Button>
            <Button className="rounded-full bg-ink text-white" onClick={onRetry}>
              Try again
            </Button>
            {quota && onOpenSample ? (
              <Button variant="outline" className="rounded-full" onClick={onOpenSample}>
                Review sample paper
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 items-center justify-center rounded-[28px] bg-white px-6 shadow-[0_12px_40px_rgba(40,30,20,0.04)]">
      <div className="text-center" aria-live="polite">
        <div className="relative mx-auto mb-8 size-20">
          <span
            className="absolute inset-0 rounded-full border-2 border-dashed border-coral/40"
            style={{ animation: "veda-orbit 8s linear infinite" }}
          />
          <span
            className="absolute inset-3 flex items-center justify-center rounded-full bg-coral-soft text-coral"
            style={{ animation: "veda-pulse 1.8s ease-in-out infinite" }}
          >
            <Sparkles className="size-8" />
          </span>
          <span
            className="absolute -top-1 right-2 size-2 rounded-full bg-coral"
            style={{ animation: "veda-spark 1.4s ease-in-out infinite" }}
          />
          <span
            className="absolute bottom-1 left-0 size-1.5 rounded-full bg-coral/70"
            style={{ animation: "veda-spark 1.8s ease-in-out 0.3s infinite" }}
          />
        </div>
        <h1 className="text-[34px] font-semibold tracking-tight text-ink">Extracting...</h1>
        <p className="mt-2 text-muted-foreground">This may take a while</p>
        <p className="mt-4 text-xs tracking-wide text-muted-foreground/80 uppercase">
          {stageLabel(stage)}
        </p>
      </div>
    </section>
  );
}