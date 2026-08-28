"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { formatFileSize } from "@/lib/file-validation";
import type { UploadedDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  titleLead: string;
  titleAccent: string;
  file: UploadedDocument | null;
  error?: string;
  onFile: (file: File) => void;
  onClear: () => void;
};

export function FileUploadCard({
  titleLead,
  titleAccent,
  file,
  error,
  onFile,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(list: FileList | null) {
    const next = list?.[0];
    if (next) onFile(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !file && inputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !file) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          handleFiles(event.dataTransfer.files);
        }}
        aria-label={`${titleLead} ${titleAccent}`}
        className={cn(
          "relative flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed bg-white px-5 py-6 text-center transition-all",
          dragOver
            ? "border-coral bg-coral-soft/70 shadow-sm"
            : "border-[#d9d3c8] hover:border-coral/70 hover:shadow-[0_8px_24px_rgba(40,30,20,0.05)]",
          file && "cursor-default border-solid border-[#ece7de] min-h-[148px]",
          error && "border-destructive/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />

        {file ? (
          <UploadedFile file={file} onClear={onClear} />
        ) : (
          <>
            <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#f6f3ee] text-ink">
              <Upload className="size-5" />
            </span>
            <p className="text-[17px] font-semibold text-ink">
              {titleLead} <span className="text-coral">{titleAccent}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Max 10MB</p>
          </>
        )}
      </div>
      {error && (
        <p className="px-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function UploadedFile({
  file,
  onClear,
}: {
  file: UploadedDocument;
  onClear: () => void;
}) {
  const pages =
    file.pageCount == null
      ? "Reading…"
      : `${file.pageCount} ${file.pageCount === 1 ? "Page" : "Pages"}`;

  return (
    <div className="flex w-full items-start gap-3 text-left">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f4eee4] text-ink">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "Image"}
        </p>
        <p className="truncate text-[15px] font-semibold text-ink">{file.name.replace(/\.pdf$/i, "")}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {formatFileSize(file.size)} • {pages}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:bg-muted hover:text-ink"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
