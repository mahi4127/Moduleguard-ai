# ModuleGuard AI

**Enterprise AI-powered quality assurance for learning & development content.**

Compare source compliance documents against AI-generated training modules to evaluate accuracy, completeness, and publish-readiness — before anything goes live.

---

## What It Does

1. **Paste** your source compliance/policy document (left)
2. **Paste** your AI-generated training module (right)
3. **Click Analyze** — the AI reviews both and returns a structured QA report with:
   - Quality Score (0–10)
   - Risk Level (Low / Medium / High)
   - Missing Topics
   - Hallucinated / Unsupported Claims
   - Readability Feedback
   - Final Recommendation (Approve / Needs Human Review / Reject)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| AI | Anthropic Claude (claude-sonnet-4) |
| Deploy | Vercel |

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd moduleguard-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at: https://console.anthropic.com/

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Try the Demo

Click **Load Demo** in the toolbar to populate with a realistic AML compliance scenario — including intentional errors in the generated module to see the QA engine flag them.

---

## Deploy to Vercel

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy
vercel
```

Add `ANTHROPIC_API_KEY` in your Vercel project settings under **Settings → Environment Variables**.

Or use the Vercel dashboard:
1. Import your GitHub repository
2. Add `ANTHROPIC_API_KEY` environment variable
3. Deploy — done

---

## Project Structure

```
moduleguard-ai/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── globals.css         # Fonts, base styles, animations
│   ├── page.tsx            # Main dashboard page
│   └── api/
│       └── analyze/
│           └── route.ts    # AI analysis API route
├── components/
│   ├── Header.tsx          # Top navigation bar
│   ├── ResultsPanel.tsx    # QA results display
│   └── LoadingSkeleton.tsx # Loading state
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── demoData.ts         # Sample AML training content
├── .env.local.example      # Environment variable template
└── README.md
```

---

## AI Evaluation Criteria

The system prompt instructs Claude to evaluate:

| Criterion | Description |
|-----------|-------------|
| **Accuracy** | Does the module correctly reflect the source? |
| **Completeness** | Are all critical compliance topics covered? |
| **Hallucinations** | Does the module invent facts not in the source? |
| **Readability** | Is the content clear and pedagogically sound? |
| **Risk** | Could inaccuracies lead to compliance violations? |

### Scoring Rubric

| Score | Interpretation |
|-------|---------------|
| 9.0–10.0 | Excellent — safe to publish |
| 7.0–8.9 | Good — minor edits recommended |
| 5.0–6.9 | Moderate — notable issues, review required |
| 3.0–4.9 | Poor — significant inaccuracies |
| 0.0–2.9 | Critical — do not publish |

---

## Notes

- Content is processed in-memory — no database required
- Inputs are truncated at 6,000 characters each for API efficiency
- This tool assists human reviewers — always have a qualified compliance officer make final publishing decisions
- The demo scenario uses an AML (Anti-Money Laundering) compliance use case

