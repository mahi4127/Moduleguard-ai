"use client";

export default function Header() {
  return (
    <header className="border-b border-[#1e2535] bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f7ef8] to-[#7c5cfc] flex items-center justify-center shadow-lg shadow-[#4f7ef8]/20">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1L12.196 3.5V8.5C12.196 11.0675 9.8735 13.0455 7 13C4.1265 13.0455 1.804 11.0675 1.804 8.5V3.5L7 1Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M5 7L6.5 8.5L9.5 5.5"
                stroke="#0f1117"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-white tracking-tight">
              ModuleGuard
            </span>
            <span className="text-[10px] font-mono font-medium text-[#4f7ef8] bg-[#4f7ef8]/10 px-1.5 py-0.5 rounded-full border border-[#4f7ef8]/20">
              AI
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-[13px] text-slate-400">
            <span className="text-slate-200 font-medium cursor-pointer">
              QA Review
            </span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">
              Docs
            </span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">
              History
            </span>
          </nav>
          <div className="h-4 w-px bg-[#1e2535]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
              LM
            </div>
            <span className="text-[13px] text-slate-300 hidden md:block">
              L&D Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
