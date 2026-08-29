import { toText, trimmed } from "@/lib/text";

function readEnv(name: string, fallback = ""): string {
  const value = process.env[name];
  if (value == null) return fallback;
  return trimmed(value).replace(/^["']|["']$/g, "");
}

function readAiApiKey(): string {
  return readEnv("AI_API_KEY") || readEnv("OPENAI_API_KEY");
}

export function getAiConfig() {
  const apiKey = readAiApiKey();
  const provider = readEnv("AI_PROVIDER", "openai") || "openai";
  const model = readEnv("AI_MODEL", "gpt-4o-mini") || "gpt-4o-mini";
  const baseUrl = (readEnv("AI_BASE_URL", "https://api.openai.com/v1") || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  return { apiKey, provider, model, baseUrl };
}

export function isLiveAiConfigured(): boolean {
  const demoFlag = readEnv("DEMO_MODE").toLowerCase();
  if (demoFlag === "true" || demoFlag === "1") return false;
  return Boolean(getAiConfig().apiKey);
}

export type AiFailureKind = "auth" | "quota" | "rate_limit" | "model" | "image" | "other";

export type ClassifiedAiError = {
  kind: AiFailureKind;
  retryable: boolean;
  message: string;
};

function parseProviderError(detail: string): { code: string; message: string } {
  try {
    const parsed = JSON.parse(detail) as {
      error?: { code?: string; type?: string; message?: string };
    };
    return {
      code: toText(parsed.error?.code || parsed.error?.type).toLowerCase(),
      message: toText(parsed.error?.message),
    };
  } catch {
    return { code: "", message: "" };
  }
}

export function classifyAiHttpError(status: number, detail: string): ClassifiedAiError {
  const parsed = parseProviderError(detail);
  const text = `${detail} ${parsed.message} ${parsed.code}`.toLowerCase();

  if (status === 401 || text.includes("invalid_api_key") || text.includes("incorrect api key")) {
    return {
      kind: "auth",
      retryable: false,
      message:
        "The AI provider rejected the API key. Check AI_API_KEY in .env.local (no quotes) and restart npm run dev.",
    };
  }

  if (
    parsed.code === "insufficient_quota" ||
    text.includes("insufficient_quota") ||
    text.includes("exceeded your current quota") ||
    (status === 429 && text.includes("billing"))
  ) {
    return {
      kind: "quota",
      retryable: false,
      message:
        "This OpenAI key has no remaining credit. Add billing at platform.openai.com, or switch to a Gemini key in Settings.",
    };
  }

  if (status === 429 || parsed.code === "rate_limit_exceeded" || text.includes("rate limit")) {
    return {
      kind: "rate_limit",
      retryable: true,
      message:
        "The AI provider is rate-limiting requests. Wait a few seconds and try again, or switch to Gemini in Settings.",
    };
  }

  if (status === 404 || (status === 400 && text.includes("model"))) {
    return {
      kind: "model",
      retryable: false,
      message:
        "That model is not available on this key. For OpenAI use gpt-4o-mini; for Gemini use gemini-2.0-flash.",
    };
  }

  if (status === 400 && text.includes("image")) {
    return {
      kind: "image",
      retryable: false,
      message: "The model could not read one of the page images. Try a clearer PDF or a JPG/PNG scan.",
    };
  }

  return {
    kind: "other",
    retryable: false,
    message: "The AI provider could not process these pages. Check the key, model, and that DEMO_MODE=false.",
  };
}

export function friendlyAiError(status: number, detail: string): string {
  return classifyAiHttpError(status, detail).message;
}

export function isQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : toText(error);
  return /no remaining credit|insufficient_quota|exceeded your current quota/i.test(message);
}

export function isRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : toText(error);
  return /rate-limiting|rate limit/i.test(message);
}

export function retryAfterMs(response: Response, detail: string, attempt: number): number {
  const header = response.headers.get("retry-after");
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.min(20_000, Math.max(1_000, seconds * 1000));
    }
  }
  const match = detail.match(/try again in (\d+(?:\.\d+)?)\s*s/i);
  if (match?.[1]) {
    return Math.min(20_000, Math.max(1_000, Number(match[1]) * 1000));
  }
  return Math.min(12_000, 1_500 * 2 ** attempt);
}

export function friendlyProcessingError(error: unknown): string {
  const message = error instanceof Error ? error.message : toText(error);
  if (
    error instanceof TypeError ||
    /is not a function|cannot read propert/i.test(message)
  ) {
    return "The AI returned question data in an unexpected format. Try again with the same files.";
  }
  return message || "We couldn't complete extraction. Please try again.";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function looksLikeParsedPayload(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(
      (item) =>
        isPlainObject(item) &&
        ("number" in item || "detectedQuestionNumber" in item || "questionNumber" in item),
    );
  }
  if (!isPlainObject(value)) return false;
  return "questions" in value || "answers" in value || "grades" in value;
}

export function extractModelText(content: unknown): string {
  if (typeof content === "string") return content;
  if (typeof content === "number" || typeof content === "boolean") return String(content);
  if (Array.isArray(content)) {
    return content.map(extractModelText).filter(Boolean).join("\n");
  }
  if (isPlainObject(content)) {
    if (typeof content.text === "string" || typeof content.text === "number") {
      return toText(content.text);
    }
    if (typeof content.content === "string") return content.content;
    if (Array.isArray(content.content)) return extractModelText(content.content);
    if (Array.isArray(content.parts)) return extractModelText(content.parts);
  }
  return "";
}

export function parseModelJson(content: unknown): unknown {
  if (looksLikeParsedPayload(content)) {
    return content;
  }

  const source = extractModelText(content);
  const trimmedSource = source.trim();
  if (!trimmedSource) {
    throw new Error("The AI provider returned an empty response.");
  }

  try {
    return JSON.parse(trimmedSource);
  } catch {
    const fenced = trimmedSource.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }
    const start = trimmedSource.indexOf("{");
    const end = trimmedSource.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmedSource.slice(start, end + 1));
    }
    throw new Error("The model returned text that was not valid JSON.");
  }
}
