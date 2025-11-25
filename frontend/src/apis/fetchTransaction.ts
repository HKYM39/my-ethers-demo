type TransactionEntity = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
};

const TRANSACTION_QUERY = `
  {
    transactions(orderBy: timestamp, orderDirection: desc) {
      hash
      from
      to
      value
      timestamp
    }
  }
`;

const SUB_GRAPH_API = "http://localhost:8000/subgraphs/name/message-store";

export async function fetchTransactionList(): Promise<TransactionEntity[]> {
  const res = await fetch(SUB_GRAPH_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
