
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectFile, ConvertedFile } from "../types";

export const convertReactToNext = async (files: ProjectFile[]): Promise<ConvertedFile[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const fileContext = files.map(f => `File: ${f.path}\nContent:\n${f.content}`).join("\n\n---\n\n");
  
  const prompt = `
    You are a world-class Senior Next.js Architect. 
    Task: Convert the provided React application into a modern Next.js (App Router) project.
    
    Requirements:
    1. Use Next.js App Router (app/ directory).
    2. Convert standard <img> to next/image and <a> to next/link.
    3. Implement SEO Metadata API.
    4. Handle 'use client' directives accurately.
    5. IMPORTANT: Include a 'README.md' in the root of the nextPath output with step-by-step setup instructions.
    6. IMPORTANT: Include a 'package-requirements.txt' listing all npm packages that need to be installed.
    
    Return the result as a JSON array of objects:
    - originalPath: The path in the original project.
    - nextPath: The recommended path in the Next.js project.
    - content: The full code content.
    - explanation: A brief note on changes.

    Source Files:
    ${fileContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalPath: { type: Type.STRING },
              nextPath: { type: Type.STRING },
              content: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["originalPath", "nextPath", "content", "explanation"]
          }
        },
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as ConvertedFile[];
  } catch (error) {
    console.error("Conversion Error:", error);
    throw error;
  }
};
