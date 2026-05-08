"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ResultsPanel from "@/components/ResultsPanel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { AnalysisResult } from "@/lib/types";
import { demoSourceContent, demoGeneratedModule } from "@/lib/demoData";

export default function HomePage() {
  const [sourceContent, setSourceContent] = useState("");
  const [generatedModule, setGeneratedModule] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = sourceContent.trim().length > 50 && generatedModule.trim().length > 50;

  const handleLoadDemo = () => {
    setSourceContent(demoSourceContent);
    setGeneratedModule(demoGeneratedModule);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!isReady) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceContent, generatedModule }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data as AnalysisResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSourceContent("");
    setGeneratedModule("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Training Content Review
            </h1>
            <span className="text-[11px] font-mono font-medium text-slate-400 bg-[#1e2535] px-2 py-1 rounded-md border border-[#2a3248]">
              v3.2
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Compare source compliance content against an AI-generated training module to evaluate accuracy, completeness, and publish-readiness.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemo}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#161b27] hover:bg-[#1c2234] border border-[#1e2535] hover:border-[#2a3248] px-3 py-2 rounded-lg transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v5M6 6l-2-2M6 6l2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 9h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Load Demo
            </button>
            {(sourceContent || generatedModule) && (
              <button
                onClick={handleClear}
                className="text-xs font-medium text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            AI engine ready
          </div>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Source Content */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Source Compliance Content
              </label>
              {sourceContent && (
                <span className="text-[11px] font-mono text-slate-500">
                  {sourceContent.length.toLocaleString()} chars
                </span>
              )}
            </div>
            <div className="relative flex-1">
              <textarea
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                placeholder="Paste source compliance manual or policy text here…"
                className="w-full h-72 lg:h-96 bg-[#161b27] border border-[#1e2535] hover:border-[#2a3248] focus:border-[#4f7ef8]/50 rounded-xl px-4 py-4 text-sm text-slate-300 placeholder:text-slate-600 transition-colors duration-200 focus:ring-2 focus:ring-[#4f7ef8]/10"
              />
              {sourceContent && (
                <div className="absolute top-3 right-3">
                  <span className="w-2 h-2 rounded-full bg-[#4f7ef8] block" />
                </div>
              )}
            </div>
          </div>

          {/* Generated Module */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                AI-Generated Training Module
              </label>
              {generatedModule && (
                <span className="text-[11px] font-mono text-slate-500">
                  {generatedModule.length.toLocaleString()} chars
                </span>
              )}
            </div>
            <div className="relative flex-1">
              <textarea
                value={generatedModule}
                onChange={(e) => setGeneratedModule(e.target.value)}
                placeholder="Paste AI-generated training content here…"
                className="w-full h-72 lg:h-96 bg-[#161b27] border border-[#1e2535] hover:border-[#2a3248] focus:border-[#4f7ef8]/50 rounded-xl px-4 py-4 text-sm text-slate-300 placeholder:text-slate-600 transition-colors duration-200 focus:ring-2 focus:ring-[#4f7ef8]/10"
              />
              {generatedModule && (
                <div className="absolute top-3 right-3">
                  <span className="w-2 h-2 rounded-full bg-violet-400 block" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analyze button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!isReady || loading}
            className={`relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isReady && !loading
                ? "bg-[#4f7ef8] hover:bg-[#6090fa] text-white shadow-lg shadow-[#4f7ef8]/25 hover:shadow-[#4f7ef8]/40 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-[#1c2234] text-slate-600 cursor-not-allowed border border-[#1e2535]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M8 2C11.3137 2 14 4.68629 14 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2L13 4.5V9C13 11.5 10.8 13.5 8 13.5C5.2 13.5 3 11.5 3 9V4.5L8 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 8L7.5 9.5L10 6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Analyze Quality
              </>
            )}
          </button>
        </div>

        {/* Hint if inputs are too short */}
        {!isReady && (sourceContent || generatedModule) && (
          <p className="text-center text-xs text-slate-600 mt-3">
            Both fields must contain at least 50 characters to run analysis.
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-fade-in">
            <svg
              className="text-red-400 mt-0.5 flex-shrink-0"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 5v3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400">Analysis failed</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && <ResultsPanel result={result} />}

        {/* Empty state */}
        {!loading && !result && !error && (
          <div className="mt-16 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#161b27] border border-[#1e2535] flex items-center justify-center mx-auto mb-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                className="text-slate-600"
              >
                <path
                  d="M11 2L19 6V11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11V6L11 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 11L10 13L14 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-1">
              No review yet
            </p>
            <p className="text-xs text-slate-700 max-w-xs mx-auto">
              Paste your source content and generated module above, or{" "}
              <button
                onClick={handleLoadDemo}
                className="text-[#4f7ef8] hover:underline"
              >
                load demo data
              </button>{" "}
              to see a sample review.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2535] bg-[#0f1117] py-5 px-6 text-center">
        <p className="text-[11px] text-slate-600">
          ModuleGuard AI · Enterprise Learning QA ·{" "}
          <span className="text-slate-700">
            AI output should be reviewed by a qualified compliance officer before deployment
          </span>
        </p>
      </footer>
    </div>
  );
}
