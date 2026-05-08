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
${sourceContent.slice(0, 5000)}

AI-GENERATED TRAINING MODULE:
${generatedModule.slice(0, 5000)}

Return ONLY a raw JSON object with no markdown, no code blocks, no explanation. Just the JSON:
{
  "qualityScore": 7.5,
  "riskLevel": "Medium",
  "missingTopics": ["topic 1", "topic 2"],
  "hallucinations": ["wrong claim 1", "wrong claim 2"],
  "readabilityFeedback": "Your feedback here.",
  "recommendation": "Needs Human Review",
  "summary": "One sentence summary."
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 9000,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("FULL DATA:", JSON.stringify(data));

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("RAW GEMINI RESPONSE:", rawText);

    if (!rawText) {
      return NextResponse.json(
        { error: `Gemini error: ${data.error?.message || "Empty response"}` },
        { status: 500 }
      );
    }

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response. Please try again." },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
