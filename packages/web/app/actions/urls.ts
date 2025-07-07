import { getPresignedGetUrl } from "./s3";

export const getUrls = async (keys: string[]) => {
    let urls: { filename: string; url: string }[] = [];
    for (const key of keys) {
        const filename = key.split("/")[1];
        const url = await getPresignedGetUrl({ key });
        urls.push({ filename, url });
    }
    return urls;
};
