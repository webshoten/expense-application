import { gql, useMutation } from "urql";
import { S3PresignedUrl } from "./schema";

interface GetS3PresignedUrlVariables {
  key: string;
}

interface GetS3PresignedUrlResponse {
  getS3PresignedUrl: S3PresignedUrl;
}

const GetS3PresignedUrlMutation = gql`
  mutation ($key: String!) {
    getS3PresignedUrl(key: $key) {
      url
    }
  }
`;

export const getS3PresignedUrlClient = () => {
  const [result, getS3PresignedUrl] = useMutation<
    GetS3PresignedUrlResponse,
    GetS3PresignedUrlVariables
  >(
    GetS3PresignedUrlMutation,
  );

  return { result, getS3PresignedUrl };
};
