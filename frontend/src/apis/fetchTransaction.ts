import { gql, request } from "graphql-request";
type TransactionEntity = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
};

export async function fetchTransactionList(): Promise<TransactionEntity[]> {
  const res = await fetch(SUB_GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({ query: TRANSACTION_QUERY }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error(json.errors);
  }

  return json.data.transactions ?? [];
}

export type { TransactionEntity };
