import { Resource } from "sst";

import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3クライアントの設定
export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
});

export const getPresignedPutUrl = async (
    { fileName, fileType }: { fileName: string; fileType: string },
) => {
    try {
        const command = new PutObjectCommand({
            Bucket: Resource.MyBucket.name!,
            Key: fileName,
            ContentType: fileType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return url;
    } catch (error) {
        console.error("Error generating upload URL:", error);
        throw error;
    }
};
