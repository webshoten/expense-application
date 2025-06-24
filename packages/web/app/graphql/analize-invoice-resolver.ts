import { geminiAnalyzeInvoice } from "@/lib/gemini-analyze-invoice";

export const analyzeInvoiceResolver = async ({ imageUrl }: {
    imageUrl: string;
}) => {
    const result = await geminiAnalyzeInvoice({ imageUrl });
    return result;
};
