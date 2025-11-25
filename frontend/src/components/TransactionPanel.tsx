import { useMemo, useState } from "react";
import "./TransactionPanel.css";

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

const networkOptions = [
  { value: "mainnet", label: "以太坊主网" },
  { value: "sepolia", label: "Sepolia 测试网" },
  { value: "holesky", label: "Holesky 测试网" },
];

const TransactionPanel = () => {
  const [inspectMode, setInspectMode] = useState<
    "alchemy" | "infura" | "ethereum"
  >("ethereum");
  const [txHash, setTxHash] = useState("");
  const [transactionView, setTransactionView] =
    useState<TransactionPreview>(emptyTransactionPreview);
  const [convertText, setConvertText] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(
    networkOptions[1].value
  );
  const [queryScope, setQueryScope] = useState<"all" | "address">("all");
  const [targetAddress, setTargetAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const networkLabel = useMemo(
    () =>
      networkOptions.find((opt) => opt.value === selectedNetwork)?.label ??
      "未知网络",
    [selectedNetwork]
  );

  const sampleTransactions: TransactionPreview[] = [
    {
      ...emptyTransactionPreview,
      hash: "0xsamplehash1",
      from: "0xFromAddress1",
      to: "0xToAddress1",
      value: 1_000_000_000_000_000_000n,
      gasPrice: 10_000_000_000n,
      gasLimit: 21_000n,
      gasUsed: 21_000n,
      timestamp: "2024-03-01 10:00:00",
      status: "success",
      statusLabel: "完成",
      inputData: "0x48656c6c6f205472616e73616374696f6e31",
    },
    {
      ...emptyTransactionPreview,
      hash: "0xsamplehash2",
      from: "0xFromAddress2",
      to: "0xToAddress2",
      value: 2_500_000_000_000_000_000n,
      gasPrice: 12_000_000_000n,
      gasLimit: 25_000n,
      gasUsed: 23_000n,
      timestamp: "2024-03-01 10:05:00",
      status: "pending",
      statusLabel: "进行中",
      inputData: "0x48656c6c6f205472616e73616374696f6e32",
    },
    {
      ...emptyTransactionPreview,
      hash: "0xsamplehash3",
      from: "0xFromAddress3",
      to: "0xToAddress3",
      value: 500_000_000_000_000_000n,
      gasPrice: 15_000_000_000n,
      gasLimit: 30_000n,
      gasUsed: 28_000n,
      timestamp: "2024-03-01 10:10:00",
      status: "failed",
      statusLabel: "失败",
      inputData: "0x48656c6c6f205472616e73616374696f6e33",
    },
  ];

  const handleSwitchInspectMode = (mode: "alchemy" | "infura" | "ethereum") => {
    setInspectMode(mode);
    console.log("[Transaction] Query mode switched", { mode });
  };

  const handleInspectTransaction = () => {
    const trimmedHash = txHash.trim();
    if (!trimmedHash) {
      console.warn("[Transaction] Missing tx hash input");
      return;
    }
    console.log("[Transaction] Inspect action triggered", {
      hash: trimmedHash,
      mode: inspectMode,
      network: selectedNetwork,
    });
    const tx: TransactionPreview = {
      ...emptyTransactionPreview,
      hash: trimmedHash,
      status: "success",
      statusLabel: "完成",
      blockNumber: 123456,
      confirmations: 3,
      timestamp: "2024-01-01 12:00:00",
      from: "0xFromAddress",
      to: "0xToAddress",
      value: 1_000_000_000_000_000_000n,
      gasPrice: 10_000_000_000n,
      gasLimit: 21_000n,
      gasUsed: 21_000n,
      nonce: 1,
      transactionType: 2,
      positionInBlock: 5,
      inputData: "0x48656c6c6f205472616e73616374696f6e",
    };
    setTransactionView(tx);
    const decodedInput = parseHexToString(tx.inputData);
    setConvertText(decodedInput ?? "");
    setIsModalOpen(true);
  };

  const handleResetTransactionView = () => {
    setTxHash("");
    setTransactionView(emptyTransactionPreview);
    setConvertText("");
    setIsModalOpen(false);
    console.log("[Transaction] Placeholder state reset");
  };

  const handleListTransactions = () => {
    console.log("[Transaction] List query triggered", {
      scope: queryScope,
      target: targetAddress,
      network: selectedNetwork,
      mode: inspectMode,
    });
  };

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    console.log("[Transaction] Network switched", { value });
  };

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
          <p>以列表为主体，点击交易哈希查看详情（弹窗占位）。</p>
        </div>
        <div className="transaction-actions">
          <div className="mode-toggle">
            <button
              type="button"
              className={`ghost ${
                inspectMode === "ethereum" ? "active" : ""
              }`}
              onClick={() => handleSwitchInspectMode("ethereum")}
            >
              使用 Ethereum
            </button>
            <button
              type="button"
              className={`ghost ${inspectMode === "alchemy" ? "active" : ""}`}
              onClick={() => handleSwitchInspectMode("alchemy")}
            >
              使用 Alchemy
            </button>
            <button
              type="button"
              className={`ghost ${inspectMode === "infura" ? "active" : ""}`}
              onClick={() => handleSwitchInspectMode("infura")}
            >
              使用 Infura
            </button>
          </div>
          <div className="transaction-buttons">
            <button
              type="button"
              className="ghost"
              onClick={handleResetTransactionView}
            >
              清空占位
            </button>
            <button type="button" onClick={handleInspectTransaction}>
              根据哈希查询
            </button>
          </div>
        </div>
      </div>

      <div className="grid">
        <label className="field">
          <span>交易哈希</span>
          <input
            autoComplete="off"
            placeholder="0xabc..."
            value={txHash}
            onChange={(event) => setTxHash(event.target.value)}
          />
        </label>
        <label className="field">
          <span>查询网络</span>
          <select
            value={selectedNetwork}
            onChange={(event) => handleNetworkChange(event.target.value)}
          >
            {networkOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="transaction-scope">
        <div className="scope-tabs">
          <button
            type="button"
            className={queryScope === "all" ? "pill active" : "pill"}
            onClick={() => setQueryScope("all")}
          >
            全网交易
          </button>
          <button
            type="button"
            className={queryScope === "address" ? "pill active" : "pill"}
            onClick={() => setQueryScope("address")}
          >
            当前地址交易
          </button>
        </div>
        <label className="field">
          <span>目标地址 (可选)</span>
          <input
            autoComplete="off"
            placeholder="0x... 不填则使用当前连接地址"
            value={targetAddress}
            onChange={(event) => setTargetAddress(event.target.value)}
            disabled={queryScope === "all"}
          />
        </label>
        <div className="transaction-buttons list-actions">
          <button type="button" className="ghost" onClick={handleListTransactions}>
            查询最近交易
          </button>
        </div>
      </div>

      <div className="transaction-section list-only">
        <h3>交易列表（占位）</h3>
        <div className="tx-list">
          {sampleTransactions.map((item) => (
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
                <small>同步 {networkLabel}</small>
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
