"use client";

import { Sparkles } from "lucide-react";
import { stageLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";

type Props = {
  stage: string;
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
};

export function ExtractionLoader({ stage, error, onRetry, onBack }: Props) {
  if (error) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-[28px] bg-white px-6 shadow-[0_12px_40px_rgba(40,30,20,0.04)]">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-coral-soft text-coral">
            <Sparkles className="size-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            We couldn&apos;t complete extraction
          </h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" className="rounded-full" onClick={onBack}>
              Back to upload
            </Button>
            <Button className="rounded-full bg-ink text-white" onClick={onRetry}>
              Try again
            </Button>
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
