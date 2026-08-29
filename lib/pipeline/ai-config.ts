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

export function friendlyAiError(status: number, detail: string): string {
  const text = toText(detail).toLowerCase();
  if (status === 401 || text.includes("invalid_api_key") || text.includes("incorrect api key")) {
    return "OpenAI rejected the API key. Check AI_API_KEY in .env.local (no quotes) and restart npm run dev.";
  }
  if (status === 429 || text.includes("insufficient_quota") || text.includes("quota")) {
    return "OpenAI quota or rate limit was hit. Check billing at platform.openai.com, then try again.";
  }
  if (status === 404 || text.includes("model")) {
    return "That model is not available on this key. Set AI_MODEL=gpt-4o-mini and restart the server.";
  }
  if (status === 400 && text.includes("image")) {
    return "OpenAI could not read one of the page images. Try a clearer PDF or a JPG/PNG scan.";
  }
  return "The AI provider could not process these pages. Check the key, model, and that DEMO_MODE=false.";
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
