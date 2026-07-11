import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy singleton — dibuat saat pertama kali dipanggil, bukan saat module load
let _model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

export function getGeminiModel() {
    if (_model) return _model;

    const apiKey = process.env.API_AI_GEMINI;
    if (!apiKey) {
        throw new Error("API_AI_GEMINI is not set in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    _model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
        },
    });

    return _model;
}
