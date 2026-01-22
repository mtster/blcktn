import { GoogleGenAI, Type } from "@google/genai";

// Removed Vite triple-slash reference to fix "Cannot find type definition file" error.

export const processUtilityBill = async (base64Image: string, mimeType: string) => {
  // Initialize GoogleGenAI with process.env.API_KEY exclusively as per requirements.
  // Creating instance inside the function ensures the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
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

    // Directly access the text property of the GenerateContentResponse object.
    const text = response.text;
    if (!text) {
      throw new Error("No text response from Gemini.");
    }

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};