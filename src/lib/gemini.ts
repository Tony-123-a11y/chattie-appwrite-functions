import { GoogleGenAI } from "@google/genai";
console.log(process.env.GOOGLE_GEMINI_API_KEY)
export const ai= new GoogleGenAI({
   apiKey: process.env.GOOGLE_GEMINI_API_KEY!
})