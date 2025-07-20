import { gql, useMutation } from "urql";
import { S3PresignedUrl, S3PresignedUrls } from "./schema";

interface GetS3PresignedUrlsVariables {
  key: string;
  fileType: string;
}

interface GetS3PresignedUrlsResponse {
  getS3PresignedUrls: S3PresignedUrls;
}

const GetS3PresignedUrlsMutation = gql`
  mutation ($key: String!,$fileType: String!) {
    getS3PresignedUrls(key: $key,fileType: $fileType) {
      getUrl
      putUrl
    }
  }
`;

export const getS3PresignedUrlsClient = () => {
  const [result, getS3PresignedUrls] = useMutation<
    GetS3PresignedUrlsResponse,
    GetS3PresignedUrlsVariables
  >(
    GetS3PresignedUrlsMutation,
  );

  return { result, getS3PresignedUrls };
};
