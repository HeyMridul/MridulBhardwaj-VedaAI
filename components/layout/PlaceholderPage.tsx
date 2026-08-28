"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function PlaceholderPage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <AppShell>
      <section className="flex flex-1 items-center justify-center rounded-[28px] bg-white px-6">
        <div className="max-w-md text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-coral uppercase">
            AI Teacher&apos;s Toolkit
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-muted-foreground">{body}</p>
          <Link
            href="/exams"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
          >
            Open Exams
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
