import { GoogleGenAI, Type } from "@google/genai";
import { Answers } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const TOTAL_QUESTIONS = 60;

// Helper to generate the response schema dynamically
const generateResponseSchema = () => {
    const properties: { [key: string]: { type: Type } } = {};
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        properties[i.toString()] = { type: Type.STRING };
    }
    return {
        type: Type.OBJECT,
        properties,
    };
};

const responseSchema = generateResponseSchema();

/**
 * Analyzes an image of an OMR sheet and extracts the shaded answers.
 * @param base64ImageData The base64 encoded image data string.
 * @returns A promise that resolves to an Answers object.
 */
export const extractAnswersFromImage = async (base64ImageData: string): Promise<Answers> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64ImageData.split(',')[1], // Remove the "data:image/jpeg;base64," prefix
    },
  };

  const textPart = {
    text: `You are an expert Optical Mark Recognition (OMR) system. Analyze this image of a ${TOTAL_QUESTIONS}-question multiple-choice answer sheet. Pay close attention to the physical layout: the columns containing the question numbers are approximately 7mm wide, and the columns for the answer options (A, B, C, D, E) are each approximately 6mm wide. There are 5 choices for each question. For each question from 1 to ${TOTAL_QUESTIONS}, identify the single shaded option. If a question has no shaded option or multiple shaded options, mark it as 'BLANK'. Provide the output as a JSON object where the keys are the question numbers (as strings from "1" to "${TOTAL_QUESTIONS}") and the values are the identified answers ('A', 'B', 'C', 'D', 'E', or 'BLANK'). Ensure every question number from 1 to ${TOTAL_QUESTIONS} is present in the final JSON object.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });
    
    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);
    
    // Validate and sanitize the response
    const sanitizedAnswers: Answers = {};
    const validAnswers = ['A', 'B', 'C', 'D', 'E', 'BLANK'];
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        const key = i.toString();
        const answer = parsedJson[key];
        if (typeof answer === 'string' && validAnswers.includes(answer.toUpperCase())) {
            sanitizedAnswers[key] = answer.toUpperCase();
        } else {
            sanitizedAnswers[key] = 'BLANK'; // Default to BLANK if invalid
        }
    }
    
    return sanitizedAnswers;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze the answer sheet. The AI model could not process the image.");
  }
};