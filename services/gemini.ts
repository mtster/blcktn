
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processUtilityBill = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract energy consumption data from this utility bill. Identify: 1. Total kWh/Usage 2. Period Start/End 3. Provider Name 4. Estimated Carbon Footprint (if possible). Output as JSON.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            provider: { type: Type.STRING },
            usage: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            period: { type: Type.STRING },
            carbon_footprint_kg: { type: Type.NUMBER },
            confidence_score: { type: Type.NUMBER }
          },
          required: ["provider", "usage", "unit"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};
