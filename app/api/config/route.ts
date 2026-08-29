import { getPipelineMode } from "@/lib/pipeline";
import { getAiConfig, isLiveAiConfigured } from "@/lib/pipeline/ai-config";

export async function GET() {
  const mode = getPipelineMode();
  const { provider, model } = getAiConfig();
  return Response.json({
    mode,
    provider: mode === "demo" ? "demo" : provider,
    model: mode === "live" ? model : undefined,
    liveConfigured: isLiveAiConfigured(),
  });
}
