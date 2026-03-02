import { GoogleGenAI } from "@google/genai";

export async function validateContent(text: string): Promise<{ isValid: boolean; reason?: string }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a content moderation AI. Analyze the following text and determine if it violates community policies.
Policies: No bad words, no rude behavior, no explicit content, no hate speech, no harassment.
If the text violates the policies, return a JSON object with "isValid": false and a "reason" string explaining why.
If the text is safe and appropriate, return a JSON object with "isValid": true.

Text to analyze:
"""
${text}
"""`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (resultText) {
      const result = JSON.parse(resultText);
      return {
        isValid: result.isValid,
        reason: result.reason,
      };
    }
    return { isValid: true };
  } catch (error) {
    console.error("Error validating content:", error);
    return { isValid: true };
  }
}
