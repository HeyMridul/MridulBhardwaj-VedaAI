"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeaderIconLink({
  href,
  label,
  children,
  dot,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-ink",
      )}
    >
      {children}
      {dot && (
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-coral" />
      )}
    </Link>
  );
}

export function UserChip() {
  return (
    <Link
      href="/settings"
      className="ml-1 flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-muted"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-[#d8c3a5] text-xs font-semibold text-ink">
        MB
      </span>
      <span className="hidden text-sm font-medium text-ink md:inline">Mridul Bhardwaj</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-muted-foreground">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
