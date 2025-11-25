import { useMemo, useState } from "react";
import "./TransactionPanel.css";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactionList } from "../apis/fetchTransaction";
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
  value: bigint;
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
  value: 0n,
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

const normalizeTx = (tx: TransactionEntity): TransactionPreview => ({
  ...emptyTransactionPreview,
  hash: tx.hash,
  from: tx.from,
  to: tx.to,
  timestamp: tx.timestamp,
  value: BigInt(tx.value || 0),
  status: "success",
  statusLabel: "完成",
});

const TransactionPanel = () => {
  const [transactionView, setTransactionView] = useState<TransactionPreview>(
    emptyTransactionPreview
  );
  const [convertText, setConvertText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactionList,
    refetchInterval: false,
  });

  const transactionList = useMemo(
    () => (data ?? []).map((item) => normalizeTx(item)),
    [data]
  );

  const handleSelectTransaction = (tx: TransactionPreview) => {
    setTransactionView(tx);
    setConvertText(parseHexToString(tx.inputData) ?? "");
    setIsModalOpen(true);
  };

  const parseHexToString = (source: string) => {
    if (!source.startsWith("0x")) return "";
    const hex = source.slice(2);
    if (hex.length % 2 !== 0) {
      console.error("传入的十六进制字符串不合法！！");
      return "";
    }
    let result = "";
    for (let index = 0; index < hex.length; index += 2) {
      result += String.fromCharCode(
        parseInt(hex.substring(index, index + 2), 16)
      );
    }
    return result;
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
                <small>{item.timestamp}</small>
              </div>
              <span className={`badge ${item.status}`}>{item.statusLabel}</span>
            </div>
          ))}
          {!transactionList.length && !isLoading && (
            <div className="empty-hint">暂无数据</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div>
                <h3>交易详情</h3>
                <p>{transactionView.hash}</p>
              </div>
              <button className="ghost" onClick={() => setIsModalOpen(false)}>
                关闭
              </button>
            </div>
            <div className="transaction-overview">
              <div className="overview-card">
                <span>区块</span>
                <strong>{transactionView.blockNumber}</strong>
                <small>{transactionView.confirmations} 次确认</small>
              </div>
              <div className="overview-card">
                <span>区块时间</span>
                <strong>{transactionView.timestamp}</strong>
              </div>
            </div>

            <div className="transaction-details">
              <div className="transaction-row">
                <span>From</span>
                <code>{transactionView.from}</code>
              </div>
              <div className="transaction-row">
                <span>To</span>
                <code>{transactionView.to}</code>
              </div>
              <div className="transaction-row">
                <span>Value</span>
                <strong>{transactionView.value}</strong>
              </div>
              <div className="transaction-row">
                <span>Gas Price (Gwei)</span>
                <code>{transactionView.gasPrice}</code>
              </div>
              <div className="transaction-row">
                <span>Gas Used / Limit</span>
                <code>
                  {transactionView.gasUsed} / {transactionView.gasLimit}
                </code>
              </div>
            </div>

            <div className="transaction-section">
              <h3>其他 Meta 信息</h3>
              <div className="meta-grid">
                <div>
                  <span>Nonce</span>
                  <strong>{transactionView.nonce}</strong>
                </div>
                <div>
                  <span>Txn Type</span>
                  <strong>{transactionView.transactionType}</strong>
                </div>
                <div>
                  <span>区块中的位置</span>
                  <strong>{transactionView.positionInBlock}</strong>
                </div>
                <div>
                  <span>Max Fee Per Gas</span>
                  <code>{transactionView.maxFeePerGas}</code>
                </div>
                <div>
                  <span>Max Priority Fee</span>
                  <code>{transactionView.maxPriorityFeePerGas}</code>
                </div>
              </div>
            </div>

            <div className="transaction-section">
              <h3>Input Data</h3>
              <pre className="input-preview">{transactionView.inputData}</pre>
            </div>
            <div className="transaction-section">
              <h3>解码后的InputData</h3>
              <pre className="input-preview">{convertText}</pre>
              {convertText.startsWith("http") && <img src={convertText} />}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TransactionPanel;
