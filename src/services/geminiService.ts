import { GoogleGenAI, Type } from "@google/genai";
import { Application, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async parseJobDescription(base64Image: string): Promise<Partial<Application>> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Extract job details from this JD screenshot. Return JSON with company, title, location, jobLocation (remote/hybrid/onsite), requirements (array of strings), and salary if available." },
              { inlineData: { mimeType: "image/png", data: base64Image.split(",")[1] || base64Image } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              title: { type: Type.STRING },
              location: { type: Type.STRING },
              jobLocation: { type: Type.STRING, enum: ["remote", "hybrid", "onsite"] },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              salary: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      return data;
    } catch (error) {
      console.error("AI Parsing failed, falling back to mock:", error);
      // Mock fallback for demo if API fails
      return {
        company: "Mock Corp",
        title: "Frontend Engineer",
        location: "San Francisco",
        jobLocation: "remote",
        requirements: ["React", "TypeScript", "Tailwind CSS"],
        salary: "$160k"
      };
    }
  },

  async getMetricInsights(metricName: string, data: any): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this job application metric: ${metricName}. Data: ${JSON.stringify(data)}. Provide a concise diagnosis, 2-3 specific improvements, and a strategy suggestion.`
      });
      return response.text || "No insights available.";
    } catch (error) {
      return "Unable to generate insights at this moment.";
    }
  },

  async getWeeklySummary(applications: Application[]): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the weekly performance for these job applications: ${JSON.stringify(applications.slice(0, 10))}. Highlight trends and give strategic advice.`
      });
      return response.text || "Keep pushing forward!";
    } catch (error) {
       return "Summary unavailable.";
    }
  },

  async calculateMatch(app: Partial<Application>, user: UserProfile) {
    // Basic scoring logic
    const userSkills = new Set(user.skills.map(s => s.toLowerCase()));
    const appReqs = app.requirements || [];
    
    if (appReqs.length === 0) return { score: 75, missing: [] };

    const matches = appReqs.filter(req => userSkills.has(req.toLowerCase()));
    const missing = appReqs.filter(req => !userSkills.has(req.toLowerCase()));
    
    const score = Math.round((matches.length / appReqs.length) * 100);
    return { score, missing };
  }
};
