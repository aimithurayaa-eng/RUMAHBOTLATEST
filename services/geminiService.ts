import { GoogleGenAI } from "@google/genai";
import { RAW_CSV_DATA, SYSTEM_INSTRUCTION } from "../constants";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_API_KEY tidak dijumpai. Pastikan ia diset dalam Vercel Environment Variables dan redeploy."
  );
}

const ai = new GoogleGenAI({ apiKey });

export const callGemini = async (prompt: string) => {
  try {
    const fullSystemInstruction = `${SYSTEM_INSTRUCTION}\n\nData CSV:\n${RAW_CSV_DATA}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.1,
      },
    });

    const text =
      (typeof response.response?.text === "function"
        ? response.response.text()
        : undefined) ?? undefined;

    return (
      text ||
      "Maaf, sistem JOMRUMAHBOT tidak dapat memproses data buat masa ini."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
