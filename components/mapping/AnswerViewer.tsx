"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import type { BoundingBox, DocumentPage, Evaluation } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  pages: DocumentPage[];
  regions: BoundingBox[];
  evaluationStatus?: Evaluation["status"];
  emptyMessage?: string;
};

export function AnswerViewer({
  pages,
  regions,
  evaluationStatus,
  emptyMessage,
}: Props) {
  const instanceId = useId();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(regions[0]?.page ?? 1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pageCount = pages.length || 1;
  const regionKey = regions.map((region) => `${region.page}:${region.y}:${region.height}`).join("|");

  const regionsByPage = useMemo(() => {
    const grouped = new Map<number, BoundingBox[]>();
    for (const region of regions) {
      const list = grouped.get(region.page) ?? [];
      list.push(region);
      grouped.set(region.page, list);
    }
    return grouped;
  }, [regions]);

  useEffect(() => {
    if (!regionKey) return;
    const pageNumber = Number(regionKey.split(":")[0]);
    if (!Number.isFinite(pageNumber)) return;
    scrollerRef.current
      ?.querySelector(`[data-answer-page="${pageNumber}"]`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [regionKey]);

  function goTo(next: number) {
    const clamped = Math.min(pageCount, Math.max(1, next));
    setPage(clamped);
    scrollerRef.current
      ?.querySelector(`[data-answer-page="${clamped}"]`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  const highlightClass =
    evaluationStatus === "partial"
      ? "border-coral bg-coral/15"
      : evaluationStatus === "incorrect" || evaluationStatus === "unmatched"
        ? "border-amber-500 bg-amber-400/15"
        : "border-emerald-500 bg-emerald-400/15";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Answer Sheet</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center rounded-full border border-border bg-white">
            <button
              type="button"
              aria-label="Zoom out"
              className="px-2 py-1.5"
              onClick={() => setZoom((value) => Math.max(70, value - 10))}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-12 text-center text-xs font-medium text-ink">{zoom}%</span>
            <button
              type="button"
              aria-label="Zoom in"
              className="px-2 py-1.5"
              onClick={() => setZoom((value) => Math.min(160, value + 10))}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center rounded-full border border-border bg-white">
            <button
              type="button"
              aria-label="Previous page"
              className="px-2 py-1.5"
              onClick={() => goTo(page - 1)}
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2 text-xs font-medium text-ink">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              aria-label="Next page"
              className="px-2 py-1.5"
              onClick={() => goTo(page + 1)}
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="relative min-h-0 flex-1 overflow-auto rounded-[22px] bg-[#efece6] p-4"
      >
        {emptyMessage && (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-xl border border-border bg-white/95 px-4 py-3 text-sm text-muted-foreground shadow-sm">
            {emptyMessage}
          </div>
        )}

        <div
          className="mx-auto space-y-4"
          style={{ width: `${zoom}%`, maxWidth: "920px" }}
        >
          {pages.map((item) => {
            const pageRegions = regionsByPage.get(item.page) ?? [];
            return (
              <div
                key={item.page}
                data-answer-page={item.page}
                id={`${instanceId}-page-${item.page}`}
                className="relative overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(40,30,20,0.08)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={`Answer sheet page ${item.page}`}
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
                {pageRegions.map((region, index) => (
                  <div
                    key={`${region.page}-${index}`}
                    className={cn(
                      "pointer-events-none absolute rounded-xl border-2 transition-all duration-300",
                      highlightClass,
                      index === 0 ? "opacity-100" : "opacity-80",
                    )}
                    style={{
                      left: `${region.x * 100}%`,
                      top: `${region.y * 100}%`,
                      width: `${region.width * 100}%`,
                      height: `${region.height * 100}%`,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
