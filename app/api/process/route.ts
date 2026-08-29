import { processAssessment } from "@/lib/pipeline";
import type { ProcessAssessmentInput } from "@/lib/types";

export const maxDuration = 120;
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: ProcessAssessmentInput;
  try {
    body = (await request.json()) as ProcessAssessmentInput;
  } catch {
    return Response.json(
      {
        ok: false,
        code: "invalid-json",
        error: "We couldn't read that request. Please try again.",
      },
      { status: 400 },
    );
  }

  const result = await processAssessment(body);
  return Response.json(result);
}
