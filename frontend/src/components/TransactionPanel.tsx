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

  const networkLabel = useMemo(
    () =>
      networkOptions.find((opt) => opt.value === selectedNetwork)?.label ??
      "未知网络",
    [selectedNetwork]
  );

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
    setTransactionView({
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
    });
    const decodedInput = parseHexToString(
      "0x48656c6c6f205472616e73616374696f6e"
    );
    setConvertText(decodedInput ?? "");
  };

  const handleResetTransactionView = () => {
    setTxHash("");
    setTransactionView(emptyTransactionPreview);
    setConvertText("");
    console.log("[Transaction] Placeholder state reset");
  };

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    console.log("[Transaction] Network switched", { value });
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
          <p>模仿 Etherscan 交易详情页的布局，仅保留 UI 骨架与占位信息。</p>
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

      <div className="transaction-overview">
        <div className="overview-card">
          <span>Tx Hash</span>
          <code>{transactionView.hash || "等待查询..."}</code>
        </div>
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
    </section>
  );
};

export default TransactionPanel;
