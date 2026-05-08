"use client";

import { useState, useEffect, useRef } from "react";
import { AnalysisResult } from "@/lib/types";

interface ResultsPanelProps {
  result: AnalysisResult;
}

function ScoreGauge({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  const color =
    score >= 8.5
      ? { text: "text-emerald-400", bar: "bg-emerald-400", glow: "shadow-emerald-400/30" }
      : score >= 6
      ? { text: "text-amber-400", bar: "bg-amber-400", glow: "shadow-amber-400/30" }
      : { text: "text-red-400", bar: "bg-red-400", glow: "shadow-red-400/30" };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarWidth((score / 10) * 100);
    }, 200);
    let frame: number;
    let start: number | null = null;
    const duration = 1000;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((ease * score).toFixed(1)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [score]);

  return (
    <div className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-3">
        Quality Score
      </p>
      <div className="flex items-end gap-2 mb-4">
        <span className={`font-mono text-4xl font-semibold ${color.text}`}>
          {display.toFixed(1)}
        </span>
        <span className="text-slate-500 font-mono text-lg mb-1">/ 10</span>
      </div>
      <div className="h-1.5 bg-[#1e2535] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color.bar} shadow-sm ${color.glow} transition-all duration-1000 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: AnalysisResult["riskLevel"] }) {
  const cfg = {
    Low: {
      bg: "bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-400",
      text: "text-emerald-400",
    },
    Medium: {
      bg: "bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-400",
      text: "text-amber-400",
    },
    High: {
      bg: "bg-red-500/10 border-red-500/20",
      dot: "bg-red-400",
      text: "text-red-400",
    },
  }[level];

  return (
    <div className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-3">
        Risk Level
      </p>
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${cfg.bg}`}
      >
        <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse-slow`} />
        <span className={`font-semibold text-sm ${cfg.text}`}>{level} Risk</span>
      </div>
      <p className="mt-3 text-xs text-slate-500 leading-relaxed">
        {level === "Low"
          ? "No critical compliance issues detected."
          : level === "Medium"
          ? "Some accuracy or coverage issues require review."
          : "Critical inaccuracies detected — immediate attention required."}
      </p>
    </div>
  );
}

function RecommendationBadge({
  rec,
}: {
  rec: AnalysisResult["recommendation"];
}) {
  const cfg = {
    Approve: {
      icon: "✅",
      bg: "bg-emerald-500/10 border-emerald-500/25",
      text: "text-emerald-300",
      label: "Approve for Publishing",
    },
    "Needs Human Review": {
      icon: "⚠️",
      bg: "bg-amber-500/10 border-amber-500/25",
      text: "text-amber-300",
      label: "Needs Human Review",
    },
    Reject: {
      icon: "❌",
      bg: "bg-red-500/10 border-red-500/25",
      text: "text-red-300",
      label: "Reject — Do Not Publish",
    },
  }[rec];

  return (
    <div className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-3">
        Final Recommendation
      </p>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.bg}`}
      >
        <span className="text-2xl">{cfg.icon}</span>
        <span className={`font-semibold text-base ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

function BulletCard({
  title,
  items,
  emptyText,
  variant = "neutral",
}: {
  title: string;
  items: string[];
  emptyText: string;
  variant?: "neutral" | "danger";
}) {
  const isEmpty = items.length === 0;
  return (
    <div className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
          {title}
        </p>
        {!isEmpty && (
          <span
            className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border ${
              variant === "danger"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-slate-500/10 border-slate-500/20 text-slate-400"
            }`}
          >
            {items.length} found
          </span>
        )}
      </div>
      {isEmpty ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M4.5 7L6.5 9L9.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-emerald-400/80">{emptyText}</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 group">
              <span
                className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  variant === "danger" ? "bg-red-400" : "bg-slate-500"
                }`}
              />
              <span
                className={`text-sm leading-relaxed ${
                  variant === "danger" ? "text-red-300/90" : "text-slate-300"
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  const handleCopy = () => {
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div ref={panelRef} className="mt-10 animate-fade-in">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">QA Review Report</h2>
          {result.summary && (
            <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
              {result.summary}
            </p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#1e2535] hover:bg-[#253048] border border-[#2a3248] px-3 py-2 rounded-lg transition-all"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect
                  x="4"
                  y="4"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M8 4V3C8 2.44772 7.55228 2 7 2H3C2.44772 2 2 2.44772 2 3V7C2 7.55228 2.44772 8 3 8H4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Copy JSON
            </>
          )}
        </button>
      </div>

      {/* Row 1: Score + Risk + Recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="stagger-1 animate-slide-up">
          <ScoreGauge score={result.qualityScore} />
        </div>
        <div className="stagger-2 animate-slide-up">
          <RiskBadge level={result.riskLevel} />
        </div>
        <div className="stagger-3 animate-slide-up">
          <RecommendationBadge rec={result.recommendation} />
        </div>
      </div>

      {/* Row 2: Missing Topics + Hallucinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="stagger-4 animate-slide-up">
          <BulletCard
            title="Missing Topics"
            items={result.missingTopics}
            emptyText="No missing topics detected"
            variant="neutral"
          />
        </div>
        <div className="stagger-5 animate-slide-up">
          <BulletCard
            title="Hallucinated / Unsupported Claims"
            items={result.hallucinations}
            emptyText="No hallucinations detected"
            variant="danger"
          />
        </div>
      </div>

      {/* Row 3: Readability */}
      <div className="stagger-6 animate-slide-up">
        <div className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-3">
            Readability & Clarity Feedback
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {result.readabilityFeedback}
          </p>
        </div>
      </div>
    </div>
  );
}
