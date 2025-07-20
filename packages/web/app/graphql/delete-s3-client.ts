import { gql, useMutation } from "urql";
import { S3PresignedUrl, S3PresignedUrls } from "./schema";

interface DeleteS3Variables {
  key: string;
}

interface DeleteS3Response {
  deleteS3: boolean;
}

const DeleteS3Mutation = gql`
  mutation ($key: String!) {
    deleteS3(key: $key) 
  }
`;

export const deleteS3Client = () => {
  const [result, deleteS3] = useMutation<
    DeleteS3Response,
    DeleteS3Variables
  >(
    DeleteS3Mutation,
  );

  return { result, deleteS3 };
};
