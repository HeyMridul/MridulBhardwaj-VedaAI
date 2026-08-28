"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { VedaLogo } from "@/components/layout/Logo";
import { HeaderIconLink } from "@/components/layout/HeaderActions";
import { unreadCount, useAppStore } from "@/lib/app-store";
import { useAssessmentStore } from "@/lib/assessment-store";

export function MobileHeader() {
  const setMobileNavOpen = useAssessmentStore((state) => state.setMobileNavOpen);
  const notifications = useAppStore((state) => state.notifications);

  return (
    <header className="flex h-14 items-center justify-between rounded-2xl border border-white bg-white px-3 shadow-[0_6px_24px_rgba(40,30,20,0.04)]">
      <Link href="/exams" className="flex items-center gap-2">
        <VedaLogo size={30} />
        <span className="text-lg font-semibold tracking-tight">VedaAI</span>
      </Link>
      <div className="flex items-center gap-1">
        <HeaderIconLink
          href="/notifications"
          label="Notifications"
          dot={unreadCount(notifications) > 0}
        >
          <Bell className="size-4" />
        </HeaderIconLink>
        <Link
          href="/settings"
          aria-label="Open profile settings"
          className="flex size-8 items-center justify-center rounded-full bg-[#d8c3a5] text-[11px] font-semibold"
        >
          MR
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-muted"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
