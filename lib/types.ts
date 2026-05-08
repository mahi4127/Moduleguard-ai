export interface AnalysisResult {
  qualityScore: number;
  riskLevel: "Low" | "Medium" | "High";
  missingTopics: string[];
  hallucinations: string[];
  readabilityFeedback: string;
  recommendation: "Approve" | "Needs Human Review" | "Reject";
  summary?: string;
}

export interface AnalyzeRequest {
  sourceContent: string;
  generatedModule: string;
}
