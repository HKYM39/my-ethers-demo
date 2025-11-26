import { useMemo, useState } from "react";
import "./TransactionPanel.css";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import type { TransactionEntity } from "../apis/fetchTransaction";

type TransactionPreview = {
  hash: string | null;
  status: "success" | "failed" | "pending";
  statusLabel: string;
  blockNumber: number | null;
  confirmations: number;
  timestamp: string;
  from: string;
  to: string | null;
  value: string;
  transactionFee?: string;
  gasPrice: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  nonce: number;
  transactionType: number;
  positionInBlock: number;
  maxFeePerGas: bigint | null;
  maxPriorityFeePerGas: bigint | null;
  inputData: string;
};

const emptyTransactionPreview: TransactionPreview = {
  hash: "",
  status: "pending",
  statusLabel: "等待查询",
  blockNumber: 0,
  confirmations: 0,
  timestamp: "--",
  from: "--",
  to: "--",
  value: "--",
  transactionFee: "--",
  gasPrice: 0n,
  gasUsed: 0n,
  gasLimit: 0n,
  nonce: 0,
  transactionType: 1,
  positionInBlock: 0,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  inputData: "0x",
};

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const normalizeTx = (tx: TransactionEntity): TransactionPreview => ({
  ...emptyTransactionPreview,
  hash: tx.id,
  from: tx.sender,
  to: CONTRACT_ADDRESS,
  timestamp: tx.timestamp,
  value: tx.message,
  status: "success",
  statusLabel: "完成",
});

const TRANSACTION_QUERY = gql`
  {
    messageStoreds(first: 5) {
      id
      sender
      message
      timestamp
    }
  }
`;

const SUB_GRAPH_API = import.meta.env.VITE_GRAPH_URL;
const apiKey = import.meta.env.VITE_GRAPH_API_KEY;

const headers = { Authorization: `Bearer ${apiKey}` };

const TransactionPanel = () => {
  const [transactionView, setTransactionView] = useState<TransactionPreview>(
    emptyTransactionPreview
  );

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["data"],
    async queryFn() {
      return await request(SUB_GRAPH_API, TRANSACTION_QUERY, {}, headers);
    },
  });

  console.log(data);

  const transactionList = useMemo(
    () => (data?.messageStoreds ?? []).map((item) => normalizeTx(item)),
    [data]
  );

  const handleSelectTransaction = (tx: TransactionPreview) => {
    setTransactionView(tx);
  };
  return (
    <section className="panel transaction-panel">
      <div className="panel-header">
        <div>
          <h2>链上交易查询</h2>
          <p>占位列表，点击哈希查看弹窗详情。</p>
        </div>
        <div className="transaction-buttons">
          <button type="button" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "查询中..." : "查询交易"}
          </button>
        </div>
      </div>

      <div className="transaction-section list-only">
        <div className="list-header">
          <h3>交易列表</h3>
          {isLoading && <span className="badge pending">加载中</span>}
          {error && <span className="badge failed">加载失败</span>}
        </div>
        <div className="tx-list">
          {transactionList.map((item) => (
            <div
              key={item.hash}
              className="tx-list-item"
              role="button"
              tabIndex={0}
              onClick={() => handleSelectTransaction(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSelectTransaction(item);
              }}
            >
              <div className="tx-list-meta">
                <strong>{item.hash}</strong>
                <p>
                  From {item.from} → To {item.to}
                </p>
                <small>Value: {item.value}</small>
              </div>
              <span className={`badge ${item.status}`}>{item.statusLabel}</span>
            </div>
          ))}
          {!transactionList.length && !isLoading && (
            <div className="empty-hint">暂无数据</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TransactionPanel;
