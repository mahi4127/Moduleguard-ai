import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { sourceContent, generatedModule } = body;

    if (!sourceContent?.trim() || !generatedModule?.trim()) {
      return NextResponse.json(
        { error: "Both fields are required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const prompt = `You are an enterprise learning quality assurance specialist. Compare the AI-generated training module against the source compliance document.

SOURCE COMPLIANCE CONTENT:
${sourceContent.slice(0, 6000)}

AI-GENERATED TRAINING MODULE:
${generatedModule.slice(0, 6000)}

Evaluate and return ONLY valid JSON, no extra text:
{
  "qualityScore": <number 0.0-10.0>,
  "riskLevel": <"Low" or "Medium" or "High">,
  "missingTopics": [<list of missing items>],
  "hallucinations": [<list of wrong/unsupported claims>],
  "readabilityFeedback": "<2-3 sentence paragraph>",
  "recommendation": <"Approve" or "Needs Human Review" or "Reject">,
  "summary": "<1-2 sentence executive summary>"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
        }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
