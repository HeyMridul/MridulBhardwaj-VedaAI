import { getPipelineMode } from "@/lib/pipeline";
import { isLiveAiConfigured } from "@/lib/pipeline/providers/openai";

export async function GET() {
  const mode = getPipelineMode();
  return Response.json({
    mode,
    provider: mode === "demo" ? "demo" : process.env.AI_PROVIDER || "openai",
    model: mode === "live" ? process.env.AI_MODEL || "gpt-4o-mini" : undefined,
    liveConfigured: isLiveAiConfigured(),
  });
}
