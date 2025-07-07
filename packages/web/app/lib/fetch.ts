export async function downloadImage(url: string): Promise<ArrayBuffer> {
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/zip",
            },
            mode: "cors", // CORSモードを明示
            cache: "no-cache", // キャッシュを制御
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        return await response.arrayBuffer();
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error);
        throw error;
    }
}
