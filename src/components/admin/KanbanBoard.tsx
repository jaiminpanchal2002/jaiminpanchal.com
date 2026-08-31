"use client";

import { useState, useTransition } from "react";
import { setApplicationStatus } from "@/app/admin/(panel)/applications/actions";
import { APPLICATION_STATUSES } from "@/lib/jobs/constants";

export interface KanbanCard {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  priority: string | null;
  workMode: string | null;
}

const priorityColor: Record<string, string> = {
  high: "bg-red-500/20 text-red-300",
  medium: "bg-amber-500/20 text-amber-300",
  low: "bg-white/10 text-white/50",
};

export function KanbanBoard({ applications }: { applications: KanbanCard[] }) {
  const [items, setItems] = useState<KanbanCard[]>(applications);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDrop = (status: string) => {
    setOverStatus(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;
    const card = items.find((i) => i.id === id);
    if (!card || card.status === status) return;

    // Optimistic, immutable update.
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    );
    startTransition(() => {
      void setApplicationStatus(id, status);
    });
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {APPLICATION_STATUSES.map((status) => {
        const cards = items.filter((i) => i.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStatus(status);
            }}
            onDragLeave={() => setOverStatus((s) => (s === status ? null : s))}
            onDrop={() => handleDrop(status)}
            className={`flex w-64 shrink-0 flex-col rounded-xl border p-3 transition-colors ${
              overStatus === status
                ? "border-[#B600A8]/50 bg-[#B600A8]/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                {status}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                {cards.length}
              </span>
            </div>
            <div className="min-h-[48px] space-y-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setDragId(card.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverStatus(null);
                  }}
                  className="cursor-grab rounded-lg border border-white/10 bg-[#141414] p-3 active:cursor-grabbing"
                >
                  <p className="text-sm font-medium text-white">
                    {card.jobTitle}
                  </p>
                  <p className="text-xs text-white/50">{card.company}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {card.priority ? (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[0.6rem] uppercase ${
                          priorityColor[card.priority] ?? priorityColor.low
                        }`}
                      >
                        {card.priority}
                      </span>
                    ) : null}
                    {card.workMode ? (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] uppercase text-white/50">
                        {card.workMode}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
