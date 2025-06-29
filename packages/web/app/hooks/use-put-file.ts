export const usePutFile = () => {
    const putFile = async (
        { type, url, file }: { type: string; url: string; file: File },
    ) => {
        /** ファイルアップロード */
        const response = await fetch(url, {
            method: "PUT",
            body: file, //files[currentId].file
            headers: {
                "Content-Type": type, // files[currentId].file.type,
            },
        });
        return response;
    };
    return { putFile };
};
