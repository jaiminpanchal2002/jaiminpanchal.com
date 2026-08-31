"use client";

import { useFormState } from "react-dom";
import { Sparkles } from "lucide-react";
import { SubmitButton } from "./form-fields";
import { runAtsAnalysis, type AtsState } from "@/app/admin/(panel)/ats/actions";
import type { AtsResult } from "@/lib/ai/ats";

interface Option {
  id: string;
  label: string;
}

const inputBase =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#B600A8] placeholder:text-white/25";

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";
  return (
    <div
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
      }}
    >
      <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-[#0C0C0C]">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-[0.6rem] uppercase tracking-wider text-white/40">
          ATS
        </span>
      </div>
    </div>
  );
}

function SubBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/50">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[#B600A8]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Chips({
  items,
  tone,
}: {
  items: string[];
  tone: "good" | "bad";
}) {
  if (items.length === 0) return null;
  const cls =
    tone === "good"
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-white/5 text-white/50";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i} className={`rounded px-2 py-0.5 text-xs ${cls}`}>
          {i}
        </span>
      ))}
    </div>
  );
}

function Result({ result }: { result: AtsResult }) {
  return (
    <div className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-5">
        <ScoreRing score={result.score} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Analysis</h3>
            {result.aiPowered ? (
              <span className="flex items-center gap-1 rounded-full bg-[#B600A8]/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-[#e084d8]">
                <Sparkles size={11} /> AI-enhanced
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-white/40">
                Deterministic
              </span>
            )}
          </div>
          <p className="mt-1 max-w-lg text-sm text-white/60">
            {result.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SubBar label="Keyword match" value={result.keywordMatch} />
        <SubBar label="Skills match" value={result.skillsMatch} />
        <SubBar label="Experience" value={result.experienceMatch} />
      </div>

      {result.matchedSkills.length > 0 ? (
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
            Matched skills
          </p>
          <Chips items={result.matchedSkills} tone="good" />
        </div>
      ) : null}

      {result.missingSkills.length > 0 ? (
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
            Skill gaps
          </p>
          <Chips items={result.missingSkills} tone="bad" />
        </div>
      ) : null}

      {result.recommendations.length > 0 ? (
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
            Recommendations
          </p>
          <ul className="space-y-1.5">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/70">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#B600A8]" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function AtsAnalyzer({
  resumes,
  jobs,
}: {
  resumes: Option[];
  jobs: Option[];
}) {
  const [state, formAction] = useFormState<AtsState, FormData>(
    runAtsAnalysis,
    {},
  );

  return (
    <div>
      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">
              Resume
            </label>
            {resumes.length > 0 ? (
              <select name="resumeId" className={inputBase}>
                <option value="" className="bg-[#0C0C0C]">
                  — Paste below —
                </option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#0C0C0C]">
                    {r.label}
                  </option>
                ))}
              </select>
            ) : null}
            <textarea
              name="resumeText"
              rows={10}
              placeholder="Paste your resume text here…"
              className={`${inputBase} resize-y font-mono text-xs`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">
              Job
            </label>
            {jobs.length > 0 ? (
              <select name="jobId" className={inputBase}>
                <option value="" className="bg-[#0C0C0C]">
                  — Paste below —
                </option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-[#0C0C0C]">
                    {j.label}
                  </option>
                ))}
              </select>
            ) : null}
            <input
              name="jobTitle"
              placeholder="Job title (optional)"
              className={inputBase}
            />
            <textarea
              name="jobText"
              rows={8}
              placeholder="Paste the job description here…"
              className={`${inputBase} resize-y font-mono text-xs`}
            />
          </div>
        </div>

        {state.error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}

        <SubmitButton>Analyze resume</SubmitButton>
      </form>

      {state.result ? <Result result={state.result} /> : null}
    </div>
  );
}
