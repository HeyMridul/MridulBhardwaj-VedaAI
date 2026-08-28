export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"] as const;

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export type FileValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function getExtension(name: string): string {
  const index = name.lastIndexOf(".");
  return index === -1 ? "" : name.slice(index).toLowerCase();
}

export function isAcceptedUpload(file: Pick<File, "name" | "type">): boolean {
  const extension = getExtension(file.name);
  if ((ACCEPTED_EXTENSIONS as readonly string[]).includes(extension)) {
    return true;
  }
  return (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);
}

export function validateUpload(
  file: Pick<File, "name" | "type" | "size">,
): FileValidationResult {
  if (!isAcceptedUpload(file)) {
    return {
      ok: false,
      message: "Please upload a PDF, PNG, JPG, JPEG, or WEBP file.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      message: "File exceeds the 10MB limit.",
    };
  }

  if (file.size === 0) {
    return {
      ok: false,
      message: "That file looks empty. Please choose another document.",
    };
  }

  return { ok: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)}KB`;
  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)}MB`;
}
