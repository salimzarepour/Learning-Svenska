import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SentencePair, RelatedWord, TopicResult } from '../types';
import { GEMINI_API_MODEL } from '../constants';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn(
    "API_KEY environment variable is not set. Gemini API calls will fail. " +
    "Ensure API_KEY is available in your execution environment (e.g., via a build process or server-side injection)."
  );
}
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

interface GeminiSentenceItem {
  swedish: string;
  persian: string;
}

interface GeminiRelatedWordItem {
  swedish: string;
  persian: string;
}

interface GeminiApiResponse {
  sentences: GeminiSentenceItem[];
  relatedWords: GeminiRelatedWordItem[];
}

export const generateSentencesAndWordsForTopic = async (topic: string): Promise<TopicResult> => {
  if (!apiKey || apiKey === "MISSING_API_KEY") {
    throw new Error("API Key is not configured. Cannot fetch content from Gemini.");
  }

  const prompt = `For a user learning Swedish, generate phrases and words for the topic: "${topic}". Provide translations in Persian.`;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      sentences: {
        type: Type.ARRAY,
        description: "5-10 example sentences in Swedish about the topic, with Persian translations.",
        items: {
          type: Type.OBJECT,
          properties: {
            swedish: { type: Type.STRING, description: "The Swedish sentence." },
            persian: { type: Type.STRING, description: "The Persian translation of the sentence." }
          },
          required: ["swedish", "persian"]
        }
      },
      relatedWords: {
        type: Type.ARRAY,
        description: "3-5 related Swedish words for the topic, with Persian translations.",
        items: {
          type: Type.OBJECT,
          properties: {
            swedish: { type: Type.STRING, description: "A related Swedish word." },
            persian: { type: Type.STRING, description: "The Persian translation of the word." }
          },
          required: ["swedish", "persian"]
        }
      }
    },
    required: ["sentences", "relatedWords"]
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonStr = response.text.trim();
    const parsedData: GeminiApiResponse = JSON.parse(jsonStr);

    if (!parsedData || typeof parsedData !== 'object' || !Array.isArray(parsedData.sentences)) {
        throw new Error("Invalid response format from Gemini API. Expected object with 'sentences' array.");
    }
    
    // Gracefully handle if relatedWords is missing, though schema requires it.
    if (!Array.isArray(parsedData.relatedWords)) {
        parsedData.relatedWords = [];
    }

    if (!parsedData.sentences.every(item => typeof item.swedish === 'string' && typeof item.persian === 'string')) {
        throw new Error("Invalid sentence format in Gemini API response.");
    }
    if (!parsedData.relatedWords.every(item => typeof item.swedish === 'string' && typeof item.persian === 'string')) {
        throw new Error("Invalid related word format in Gemini API response.");
    }
    
    const sentences: SentencePair[] = parsedData.sentences.map((item) => ({
      id: crypto.randomUUID(),
      swedish: item.swedish,
      persian: item.persian,
      topic: topic,
    }));

    const relatedWords: RelatedWord[] = parsedData.relatedWords.map((item) => ({
      id: crypto.randomUUID(),
      swedish: item.swedish,
      persian: item.persian,
      topic: topic,
    }));

    return { sentences, relatedWords };

  } catch (error) {
    console.error("Error fetching content from Gemini:", error);
    if (error instanceof Error && error.message.includes("API Key not valid")) {
         throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
    throw new Error(`Failed to generate content for topic "${topic}". Please try again. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
};