import JSZip from "jszip";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;

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

export function arrayBufferToFile(
    buffer: ArrayBuffer,
    fileName: string, // 同じファイル名を使う場合
    mimeType: string = "application/octet-stream",
): File {
    return new File([buffer], fileName, { type: mimeType });
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

export async function createZipFromFiles(files: File[]): Promise<void> {
    const zip = new JSZip();

    // 各ファイルをZIPに追加
    for (const file of files) {
        const fileData = await readFileAsArrayBuffer(file);
        zip.file(file.name, fileData);
    }

    // ZIPファイルを生成
    const content = await zip.generateAsync({ type: "blob" });

    // ダウンロード
    saveAs(content, "archive.zip");
}
