
import { GoogleGenAI } from "@google/genai";

export const getOrganicInsight = async (productType: string = "general organic"): Promise<string> => {
  try {
    // Check if process and process.env.API_KEY are available to prevent crash
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : null;
    
    if (!apiKey) {
      console.warn("API Key not found, using fallback content.");
      return "Authentic organic products ensure the highest standards of safety and sustainability for your family.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, trust-building statement (2 sentences) about why ${productType} products are better when verified for authenticity. Mention health and environmental sustainability.`,
    });
    
    return response.text || "Authentic organic products ensure the highest standards of safety and sustainability for your family.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Authenticity verification protects consumers from hazardous counterfeits while supporting sustainable organic farming.";
  }
};
