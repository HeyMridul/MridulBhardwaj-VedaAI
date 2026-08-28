"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { TeacherIllustration } from "@/components/layout/TeacherIllustration";
import { FileUploadCard } from "@/components/upload/FileUploadCard";
import { useAssessmentStore } from "@/lib/assessment-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadPage() {
  const router = useRouter();
  const questionPaper = useAssessmentStore((state) => state.questionPaper);
  const answerSheet = useAssessmentStore((state) => state.answerSheet);
  const uploadError = useAssessmentStore((state) => state.uploadError);
  const setUpload = useAssessmentStore((state) => state.setUpload);
  const clearUpload = useAssessmentStore((state) => state.clearUpload);
  const loadSampleDocuments = useAssessmentStore((state) => state.loadSampleDocuments);

  const ready = Boolean(questionPaper && answerSheet);

  async function handleFile(
    slot: "questionPaper" | "answerSheet",
    file: File,
  ) {
    const error = await setUpload(slot, file);
    if (error) toast.error(error);
  }

  return (
    <section className="flex flex-1 flex-col items-center overflow-y-auto rounded-[28px] bg-white px-5 py-10 shadow-[0_12px_40px_rgba(40,30,20,0.04)] sm:px-10 lg:px-16">
      <div className="flex w-full max-w-4xl flex-1 flex-col items-center">
        <h1 className="max-w-3xl text-center text-[28px] leading-tight font-semibold tracking-tight text-ink sm:text-[40px]">
          Upload{" "}
          <span className="rounded-md bg-coral-soft px-1.5 text-coral">
            Question Paper & Answer Sheets
          </span>
        </h1>
        <p className="mt-3 text-center text-muted-foreground">
          Upload both files to get started
        </p>

        <TeacherIllustration className="mt-6" />

        <div className="mt-4 grid w-full gap-4 md:grid-cols-2">
          <FileUploadCard
            titleLead="Upload"
            titleAccent="Question Paper"
            file={questionPaper}
            error={uploadError.questionPaper}
            onFile={(file) => void handleFile("questionPaper", file)}
            onClear={() => clearUpload("questionPaper")}
          />
          <FileUploadCard
            titleLead="Upload"
            titleAccent="Answer Sheet"
            file={answerSheet}
            error={uploadError.answerSheet}
            onFile={(file) => void handleFile("answerSheet", file)}
            onClear={() => clearUpload("answerSheet")}
          />
        </div>

        <Button
          disabled={!ready}
          onClick={() => router.push("/exams/processing")}
          className={cn(
            "mt-8 h-14 w-full max-w-md rounded-full px-8 text-[15px] font-semibold",
            ready
              ? "bg-ink text-white hover:scale-[1.01] hover:bg-ink/90"
              : "bg-[#d8d4cc] text-white",
          )}
        >
          Start Mapping
          <ArrowRight className="size-4" />
        </Button>

        <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
          Once both files are uploaded, you&apos;ll be able to map answers with questions
        </p>

        <button
          type="button"
          className="mt-6 text-sm font-medium text-coral underline-offset-4 hover:underline"
          onClick={async () => {
            try {
              await loadSampleDocuments();
              toast.success("Sample Class 10 Biology papers loaded.");
            } catch {
              toast.error("Could not load sample documents.");
            }
          }}
        >
          Load sample documents
        </button>
      </div>
    </section>
  );
}
