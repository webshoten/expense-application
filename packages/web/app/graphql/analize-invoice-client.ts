import { gql, useMutation } from "urql";
import { Invoice } from "./schema";

interface AnalyzeInvoiceVariables {
  imageUrl: string;
}

interface AnalyzeInvoiceResponse {
  analyzeInvoice: Invoice;
}

const AnalyzeInvoiceMutation = gql`
  mutation ($imageUrl: String!) {
    analyzeInvoice(imageUrl: $imageUrl) {
      company
      amount
      yyyymmdd
    }
  }
`;

export const analyzeInvoiceClient = () => {
  const [result, analyzeInvoice] = useMutation<
    AnalyzeInvoiceResponse,
    AnalyzeInvoiceVariables
  >(
    AnalyzeInvoiceMutation,
  );

  return { result, analyzeInvoice };
};
