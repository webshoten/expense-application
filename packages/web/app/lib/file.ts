// ローカルの画像ファイルを読み込み、Base64エンコードする関数
export async function readImageFileBuffer(
    filePath: string,
): Promise<{ data: string; mimeType: string }> {
    try {
        const res = await fetch(filePath);
        const arrayBuffer = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = res.headers.get("content-type") || "";
        return { data: base64, mimeType };
    } catch (error) {
        console.error(
            `画像ファイルの読み込みに失敗しました: ${filePath}`,
            error,
        );
        throw error;
    }
}
