import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  try {
    const file = join(
      process.cwd(),
      "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
    );
    const body = await readFile(file);
    return new Response(body, {
      headers: {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("PDF worker missing. Run npm install.", { status: 404 });
  }
}
