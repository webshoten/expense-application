import type { MetaFunction } from "@remix-run/node";
import { gql, useQuery } from "urql";
import type { Employee } from "../graphql/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface EmployeeQueryResult {
  employee: Employee;
}

interface EmployeeQueryVariables {
  id: number;
}

export default function Index() {
  const EmployeeQuery = gql`
    query ($id: Int!) {
      employee(id: $id) {
        id
        name
      }
    }
  `;

  const [result] = useQuery<EmployeeQueryResult, EmployeeQueryVariables>({
    query: EmployeeQuery,
    variables: {
      id: 1,
    },
  });

  if (result.fetching) return <p>Loading...</p>;
  if (result.error) return <p>Error: {result.error.message}</p>;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to Remix_SST_Graphql Company
          </h1>
        </header>
        <body>従業員1：{result.data?.employee.name}</body>
      </div>
    </div>
  );
}
