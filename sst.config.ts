/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    /**
     *  S3
     */
    const bucket = new sst.aws.Bucket("MyBucket", {
      cors: {
        allowHeaders: ["*"],
        allowMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        allowOrigins: ["*"], // 本番環境では適切なドメインに制限してください
        exposeHeaders: ["ETag", "Content-Length", "Content-Type"],
        maxAge: "3000 seconds",
      },
      public: false, // プライベートバケットのまま
    });

    /**
     *  Remix(CloudFront+Lambda+s3)
     */
    new sst.aws.Remix("MyWeb", {
      path: "./packages/web",
      link: [bucket],
      environment: {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        BUCKET_NAME: bucket.name,
      },
    });
  },
});
