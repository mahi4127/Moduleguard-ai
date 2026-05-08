import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an enterprise learning & development quality assurance specialist with deep expertise in regulatory compliance training. Your role is to rigorously evaluate AI-generated training modules against their source compliance documents.

Your evaluation must be precise, impartial, and actionable. You identify:
1. MISSING TOPICS: Critical information in the source that is absent or inadequately covered in the generated module
2. HALLUCINATIONS: Claims in the generated module that contradict, exaggerate, or are not supported by the source content — include specific details like wrong numbers, incorrect timelines, unsupported claims
3. READABILITY: Clarity, consistency of terminology, structure, and learning effectiveness
4. COMPLIANCE COVERAGE: How comprehensively the module covers the essential compliance requirements
5. OVERALL QUALITY: Holistic assessment considering accuracy, completeness, and pedagogical value

SCORING RUBRIC:
- 9.0–10.0: Excellent — accurate, complete, well-structured. Safe to publish.
- 7.0–8.9: Good — minor gaps or issues. May publish with minor edits.
- 5.0–6.9: Moderate — notable missing topics or inaccuracies. Needs review.
- 3.0–4.9: Poor — significant inaccuracies or major gaps. Must be rejected.
- 0.0–2.9: Critical — dangerous inaccuracies or near-complete failure.

RECOMMENDATION LOGIC:
- "Approve": Score ≥ 8.5 AND riskLevel = "Low"
- "Needs Human Review": Score 5.0–8.4 OR riskLevel = "Medium"
- "Reject": Score < 5.0 OR riskLevel = "High" OR hallucinations contain compliance-critical errors

You MUST respond with ONLY valid JSON — no preamble, no markdown, no explanation outside the JSON object. Use this exact schema:

{
  "qualityScore": <number 0.0–10.0, one decimal place>,
  "riskLevel": <"Low" | "Medium" | "High">,
  "missingTopics": [<concise bullet strings, max 8>],
  "hallucinations": [<specific claim + correction, max 8>],
  "readabilityFeedback": <2-3 sentence paragraph>,
  "recommendation": <"Approve" | "Needs Human Review" | "Reject">,
  "summary": <1-2 sentence executive summary of the review>
}`;

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { sourceContent, generatedModule } = body;

    if (!sourceContent?.trim() || !generatedModule?.trim()) {
      return NextResponse.json(
        { error: "Both source content and generated module are required." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const userPrompt = `Please evaluate the following AI-generated training module against the provided source compliance document.

---SOURCE COMPLIANCE CONTENT---
${sourceContent.slice(0, 6000)}

---AI-GENERATED TRAINING MODULE---
${generatedModule.slice(0, 6000)}

Evaluate accuracy, completeness, and safety. Return ONLY valid JSON.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown fences
    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
