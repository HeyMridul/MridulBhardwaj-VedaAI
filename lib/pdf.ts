"use client";

import type { DocumentPage } from "@/lib/types";

const MAX_RENDER_WIDTH = 768;
const JPEG_QUALITY = 0.5;
const MAX_PAGES = 4;

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/api/pdf-worker";
  return pdfjs;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const document = await pdfjs.getDocument({ data }).promise;
  const pages = document.numPages;
  return pages;
}

export async function inspectDocumentPages(file: File): Promise<number> {
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name)) {
    return 1;
  }
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      return await getPdfPageCount(file);
    } catch {
      throw new Error("We couldn't read that PDF. The file may be corrupted.");
    }
  }
  return 1;
}

export async function renderDocumentPages(file: File): Promise<DocumentPage[]> {
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name)) {
    const src = await fileToJpegDataUrl(file);
    return [{ page: 1, src }];
  }

  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const document = await pdfjs.getDocument({ data }).promise;
  const pages: DocumentPage[] = [];

  const pageTotal = Math.min(document.numPages, MAX_PAGES);
  for (let pageNumber = 1; pageNumber <= pageTotal; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const unscaled = page.getViewport({ scale: 1 });
    const scale = Math.min(2, MAX_RENDER_WIDTH / unscaled.width);
    const viewport = page.getViewport({ scale });
    const canvas = window.document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to render PDF pages in this browser.");
    }
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    pages.push({
      page: pageNumber,
      src: canvas.toDataURL("image/jpeg", JPEG_QUALITY),
      width: canvas.width,
      height: canvas.height,
    });
  }

  return pages;
}

export async function extractDocumentText(file: File): Promise<string> {
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name)) {
    return "";
  }
  if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
    return "";
  }

  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const document = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];
  const pageTotal = Math.min(document.numPages, MAX_PAGES);

  for (let pageNumber = 1; pageNumber <= pageTotal; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (line) parts.push(line);
  }

  return parts.join("\n");
}

async function fileToJpegDataUrl(file: File): Promise<string> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(imageUrl);
    const scale = Math.min(1, MAX_RENDER_WIDTH / image.width);
    const canvas = window.document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return imageUrl;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("We couldn't read that image."));
    image.src = src;
  });
}