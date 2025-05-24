"use client";

import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import type { ReactNode } from "react";
import { Provider } from "urql";

export default function UrqlProvider({ children }: { children: ReactNode }) {
  const client = createClient({
    url: "/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

  return <Provider value={client}>{children}</Provider>;
}
