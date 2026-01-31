import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Define the response schema using the @google/genai SDK types
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Overall accessibility score 0-100 (100 is perfectly accessible)" },
    accessibilityInsight: { type: Type.STRING, description: "1-sentence strategic summary of the content's design" },
    riskMeters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING, enum: ["ADHD", "Dyslexia", "Anxiety", "Autism"] },
          level: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          score: { type: Type.NUMBER, description: "Risk score 0-100" },
          colorCode: { type: Type.STRING, description: "Hex color code for the risk level" },
          summary: { type: Type.STRING, description: "Short description of the primary risk factor" }
        },
        required: ["condition", "level", "score", "colorCode", "summary"]
      }
    },
    detailedAnalysis: {
      type: Type.OBJECT,
      properties: {
        ADHD: {
          type: Type.OBJECT,
          properties: {
            triggerSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "The specific sentence triggering the risk" },
                  issueType: { type: Type.STRING, description: "e.g., 'High Instruction Density'" },
                  reasoning: { type: Type.STRING, description: "Brief explanation of the cognitive barrier" },
                  microFix: { type: Type.STRING, description: "A rewritten, meaning-preserving version of the text" }
                }
              }
            },
            barrierExplanation: { type: Type.STRING }
          }
        },
        Dyslexia: {
          type: Type.OBJECT,
          properties: {
            triggerSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  issueType: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  microFix: { type: Type.STRING }
                }
              }
            },
            barrierExplanation: { type: Type.STRING }
          }
        },
        Anxiety: {
          type: Type.OBJECT,
          properties: {
            triggerSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  issueType: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  microFix: { type: Type.STRING }
                }
              }
            },
            barrierExplanation: { type: Type.STRING }
          }
        },
        Autism: {
          type: Type.OBJECT,
          properties: {
            triggerSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  issueType: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  microFix: { type: Type.STRING }
                }
              }
            },
            barrierExplanation: { type: Type.STRING }
          }
        }
      }
    },
    rectification: {
      type: Type.OBJECT,
      properties: {
        originalContent: { type: Type.STRING },
        rectifiedContent: { type: Type.STRING, description: "Full, structurally optimized version of the input" },
        changeLog: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of quantifiable changes (e.g., 'Reduced sentence length by 40%')" },
        loadReductionPercentage: { type: Type.STRING, description: "e.g. '45%'" }
      },
      required: ["rectifiedContent", "changeLog", "loadReductionPercentage"]
    }
  },
  required: ["overallScore", "accessibilityInsight", "riskMeters", "detailedAnalysis", "rectification"]
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
  ACT AS: A "Cognitive Load & Accessibility Architect" and "Neurodiversity Content Consultant".
  
  YOUR MISSION: Analyze the provided educational text to identify and rectify structural barriers for neurodiverse learners (ADHD, Dyslexia, Autism, Anxiety).
  
  CORE PHILOSOPHY: Analyze the content, not the learner. Avoid medical diagnosis; focus on linguistic friction.
  
  ANALYSIS GUIDELINES (Identify "Atomic Signals"):
  1. ADHD:
     - "Instruction Density": Flag sentences with 3+ discrete tasks.
     - "Long Paragraphs": Flag blocks of text >5 lines without breaks.
  2. Dyslexia:
     - "Complex Nesting": Flag subordinate clauses that bury the main verb.
     - "Ambiguous Language": Flag unclear pronouns or passive voice.
  3. Anxiety:
     - "Temporal Cues": Flag words like "immediately", "timer", "countdown".
     - "High-Pressure Phrasing": Flag language implying catastrophic failure.
  4. Autism:
     - "Logic Reversals": Flag double negations ("not unlike"), "unless/except" loops.
     - "Abstract Metaphors": Flag non-literal language (idioms).

  SCORING RULES:
  - HIGH RISK (0-40 score): 3+ frequent triggers found.
  - MEDIUM RISK (41-79 score): 1-2 triggers found sporadically.
  - LOW RISK (80-100 score): Content is clear, atomic, and predictable.

  RECTIFICATION STRATEGY (Generate "rectifiedContent"):
  - Apply "Micro-Fixes": Split long sentences, convert paragraphs to bullet points, remove double negatives.
  - Maintain educational rigor and original meaning.
  
  OUTPUT INSTRUCTIONS:
  - "accessibilityInsight": A 1-sentence strategic summary of the content's design.
  - "riskMeters": Generate a meter for EACH condition (ADHD, Dyslexia, Anxiety, Autism).
  - "detailedAnalysis": For each condition, list "triggerSentences". 
     - "issueType": Use the specific terms above (e.g., "High Instruction Density").
     - "microFix": Provide the rewritten sentence.
  - "rectification":
     - "changeLog": List QUANTIFIABLE changes (e.g., "Reduced sentence length by 40%", "Split 3 multi-step instructions").
     - "loadReductionPercentage": Estimate the percentage reduction in cognitive load (e.g., "35%").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: `System Instruction: ${systemPrompt}` }] },
        { role: "user", parts: [{ text: `Content to Analyze:\n${text}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(responseText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
