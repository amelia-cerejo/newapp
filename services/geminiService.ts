
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartTaskBreakdown = async (taskTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down the task "${taskTitle}" into 3-5 actionable sub-tasks. Return only the sub-tasks as a simple list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING }
            },
            required: ["title"],
            propertyOrdering: ["title"]
          }
        }
      }
    });
    
    // Use .text property to access the extracted string output.
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return null;
  }
};

export const getDailyInspiration = async (tasksCount: number, habitsCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User has ${tasksCount} tasks and ${habitsCount} habits today. Give a very short (max 15 words) motivational boost in Portuguese.`,
    });
    // Use .text property directly instead of method call.
    return response.text || "Mantenha o foco e a consistência hoje!";
  } catch (error) {
    return "Mantenha o foco e a consistência hoje!";
  }
};
