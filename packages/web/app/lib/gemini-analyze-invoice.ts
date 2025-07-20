import { getGeminiModel } from "@/lib/gemini";
import { readImageFileBuffer } from "./file";

// 画像を分析する関数
export async function geminiAnalyzeInvoice({ imageUrl }: {
    imageUrl: string;
}) {
    try {
        const model = getGeminiModel();
        const { data: base64, mimeType } = await readImageFileBuffer(imageUrl);

        const prompt =
            `このレシートの日付(yyyymmdd)と会社と金額(合計)をカンマ区切りで返してください`;
        const imagePart = {
            inlineData: {
                data: base64,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const items = response.text().trim().split(",");
        if (items[0] === "判断できません") {
            return null;
        }

        return { yyyymmdd: items[0], company: items[1], amount: items[2] };
    } catch (error) {
        console.error(
            `画像の分析中にエラーが発生しました: ${imageUrl}`,
            error,
        );
        return null;
    }
}
