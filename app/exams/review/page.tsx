"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { MappingWorkspace } from "@/components/mapping/MappingWorkspace";
import { useAssessmentStore } from "@/lib/assessment-store";

export default function ReviewPage() {
  const router = useRouter();
  const result = useAssessmentStore((state) => state.result);

  useEffect(() => {
    if (!result) {
      router.replace("/exams");
    }
  }, [result, router]);

  if (!result) return null;

  return (
    <AppShell>
      <MappingWorkspace result={result} />
    </AppShell>
  );
}
