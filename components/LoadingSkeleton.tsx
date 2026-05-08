"use client";

export default function LoadingSkeleton() {
  return (
    <div className="mt-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-[#4f7ef8] animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#4f7ef8] animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#4f7ef8] animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="text-sm text-slate-400 font-medium">
          Analyzing content quality…
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5 h-28 shimmer"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5 h-44 shimmer"
          />
        ))}
      </div>
      <div className="rounded-xl border border-[#1e2535] bg-[#161b27] p-5 h-32 shimmer" />
    </div>
  );
}
