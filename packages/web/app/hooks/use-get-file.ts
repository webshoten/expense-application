export const useGetFile = () => {
    const getFile = async (
        { filename, url }: { filename: string; url: string },
    ) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "image/jpeg", // 適切なContent-Typeを指定
                },
                mode: "cors", // CORSモードを明示
                cache: "no-cache", // キャッシュを制御
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status}`,
                );
            }
            const blob = await response.blob();
            const file = new File([blob], filename, {
                type: blob.type || "application/octet-stream",
                lastModified: Date.now(),
            });
            return file;
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };
    return { getFile };
};
