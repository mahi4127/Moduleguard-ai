import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModuleGuard AI — Training Content QA",
  description:
    "Enterprise-grade AI-powered quality assurance for learning & development content.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f1117] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
