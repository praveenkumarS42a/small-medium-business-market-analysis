import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export interface MarketAnalysisRequest {
  industry: string;
  domain: string;
  budget: string;
  currentMaturity: string;
}

export async function generateMarketAnalysis(data: MarketAnalysisRequest) {
  if (!API_KEY) {
    console.warn("Gemini API key not found. Returning mock analysis.");
    return getMockAnalysis(data);
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
  });

  const prompt = `
    Conduct a high-level competitive AI market analysis for a company in the following context:
    - Industry: ${data.industry}
    - Domain: ${data.domain}
    - Annual AI Budget: ${data.budget}
    - Current Maturity Status: ${data.currentMaturity}

    Your task:
    1. Identify 2-3 top-performing companies or startups in this specific domain that have achieved high ROI through AI.
    2. Explain what specific AI strategies or technologies made them successful.
    3. Compare their budget/approach with the user's current situation.
    4. Provide 3 actionable recommendations to improve ROI.

    Return the result in the following JSON format:
    {
      "competitors": [
        { "name": "string", "roi_highlight": "string", "key_strategy": "string" }
      ],
      "market_trends": ["string"],
      "comparison_insight": "string",
      "recommendations": ["string"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Extract JSON from the response text (it might have markdown code blocks)
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating market analysis:", error);
    return getMockAnalysis(data);
  }
}

function getMockAnalysis(data: MarketAnalysisRequest) {
  return {
    competitors: [
      {
        name: `${data.industry} Leader A`,
        roi_highlight: "340% ROI in 18 months",
        key_strategy: "Automated customer lifecycle management"
      },
      {
        name: "Innovator Startup X",
        roi_highlight: "50% reduction in operational costs",
        key_strategy: "Predictive maintenance using synthetic data"
      }
    ],
    market_trends: [
      `Increasing adoption of LLMs in ${data.domain}`,
      "Shift towards decentralized AI governance",
      "Focus on ROI-driven data readiness"
    ],
    comparison_insight: `While your budget of ${data.budget} is competitive for the ${data.industry} mid-market, your ${data.currentMaturity} maturity suggests a gap in execution compared to leaders who prioritize Data Pipelines first.`,
    recommendations: [
      "Prioritize data labeling and quality over model quantity",
      "Implement a 'Build-Measure-Learn' loop for AI features",
      "Focus on low-hanging fruit in customer support automation"
    ]
  };
}
