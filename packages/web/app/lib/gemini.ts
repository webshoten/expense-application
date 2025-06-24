import { GoogleGenerativeAI } from "@google/generative-ai";

// 環境変数からAPIキーを取得し、検証する関数
export function getApiKey(): string {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
        console.error(
            "GEMINI_API_KEY 環境変数が設定されていません。",
        );
        process.exit(1);
    }
    return apiKey;
}

// Geminiモデルを初期化する関数
export function getGeminiModel() {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
}
