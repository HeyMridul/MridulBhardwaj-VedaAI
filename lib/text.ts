export function toText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(toText).filter(Boolean).join(" ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.text === "string" || typeof record.text === "number") {
      return toText(record.text);
    }
    if (record.number != null) return toText(record.number);
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  try {
    return String(value);
  } catch {
    return "";
  }
}

export function trimmed(value: unknown): string {
  return toText(value).trim();
}