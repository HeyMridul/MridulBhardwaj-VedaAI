"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/lib/app-store";

export default function SettingsPage() {
  const emailAlerts = useAppStore((state) => state.emailAlerts);
  const productTips = useAppStore((state) => state.productTips);
  const setEmailAlerts = useAppStore((state) => state.setEmailAlerts);
  const setProductTips = useAppStore((state) => state.setProductTips);

  return (
    <AppShell>
      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_12px_40px_rgba(40,30,20,0.04)] sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profile and school details for this session.</p>

        <div className="mt-8 grid max-w-3xl gap-4">
          <article className="flex items-center gap-4 rounded-2xl border border-border p-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#d8c3a5] text-lg font-semibold">
              MB
            </span>
            <div>
              <p className="font-semibold text-ink">Mridul Bhardwaj</p>
              <p className="text-sm text-muted-foreground">Teacher · Computer Science department</p>
            </div>
          </article>

          <article className="rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">School</p>
            <p className="mt-1 font-semibold text-ink">Delhi Public School</p>
            <p className="text-sm text-muted-foreground">Haridwar Uttarakhand</p>
          </article>

          <article className="rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Alerts</p>
            <ToggleRow
              label="Notify me when mapping finishes"
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <ToggleRow
              label="Show product tips on Home"
              checked={productTips}
              onChange={setProductTips}
            />
          </article>
        </div>

        <Link href="/exams" className="mt-8 inline-flex text-sm font-semibold text-coral hover:underline">
          Back to Exams
        </Link>
      </section>
    </AppShell>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 text-sm text-ink">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-coral" : "bg-[#d8d4cc]"}`}
      >
            <span
              className="absolute top-0.5 size-5 rounded-full bg-white transition"
              style={{ left: checked ? "22px" : "2px" }}
            />
      </button>
    </label>
  );
}
