import { Resource } from "sst";

import {
    type _Object,
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3クライアントの設定
export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
});

/**
 * ファイルアップロード用PresignedUrl発行
 */
export const getPresignedPutUrl = async (
    { key, fileType }: { key: string; fileType: string },
) => {
    try {
        const command = new PutObjectCommand({
            Bucket: Resource.MyBucket.name!,
            Key: key,
            ContentType: fileType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return url;
    } catch (error) {
        console.error("Error generating upload URL:", error);
        throw error;
    }
};

/**
 * ファイルリストを取得
 */
export const listAllObjects = async () => {
    let continuationToken: string | undefined;
    let allObjects: _Object[] = [];

    do {
        const response = await s3Client.send(
            new ListObjectsV2Command({
                Bucket: Resource.MyBucket.name!,
                ContinuationToken: continuationToken,
            }),
        );

        if (response.Contents) {
            allObjects = [...allObjects, ...response.Contents];
        }

        continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return allObjects;
};

/**
 * ファイルダウンロード用PresignedUrl発行
 */
export const getPresignedGetUrl = async (
    { key }: { key: string },
) => {
    try {
        const command = new GetObjectCommand({
            Bucket: Resource.MyBucket.name!,
            Key: key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return url;
    } catch (error) {
        console.error("Error generating upload URL:", error);
        throw error;
    }
};

/**
 * ファイル削除実行
 */
export const deleteObject = async ({ key }: { key: string }) => {
    try {
        const data = await s3Client.send(
            new DeleteObjectCommand({
                Bucket: Resource.MyBucket.name!,
                Key: key,
            }),
        );
        console.log("ファイル削除成功", data);
        return data;
    } catch (err) {
        console.error("ファイル削除エラー", err);
        throw err;
    }
};
