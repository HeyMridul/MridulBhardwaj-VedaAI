"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useAssessmentStore } from "@/lib/assessment-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const mobileNavOpen = useAssessmentStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useAssessmentStore((state) => state.setMobileNavOpen);

  return (
    <div className="h-svh overflow-hidden bg-page">
      <div className="flex h-full gap-3 p-3 lg:gap-4 lg:p-4">
        <div className="hidden h-full lg:block">
          <Sidebar />
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col gap-3">
          <div className="shrink-0 lg:hidden">
            <MobileHeader />
          </div>
          <div className="hidden shrink-0 lg:block">
            <TopHeader />
          </div>
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/30"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(86vw,300px)] p-3">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
