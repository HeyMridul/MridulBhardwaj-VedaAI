"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { unreadCount, useAppStore } from "@/lib/app-store";

export default function NotificationsPage() {
  const notifications = useAppStore((state) => state.notifications);
  const markRead = useAppStore((state) => state.markRead);
  const markAllRead = useAppStore((state) => state.markAllRead);
  const unread = unreadCount(notifications);

  return (
    <AppShell>
      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_12px_40px_rgba(40,30,20,0.04)] sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unread === 0 ? "You are caught up." : `${unread} unread`}
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={markAllRead}
            disabled={unread === 0}
          >
            Mark all as read
          </Button>
        </div>

        <ul className="space-y-3">
          {notifications.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => markRead(item.id)}
                className={`block rounded-2xl border px-4 py-4 transition hover:border-coral/40 ${
                  item.read ? "border-border bg-white" : "border-coral/30 bg-coral-soft/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
