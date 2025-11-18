import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BrowserProvider } from "ethers";
import { JsonRpcSigner } from "ethers";
import { formatEther } from "ethers";
import { EtherscanProvider } from "ethers";

const networkOptions = [
  { value: "mainnet", label: "以太坊主网", description: "全网正式资产" },
  { value: "sepolia", label: "Sepolia 测试网", description: "官方测试网络" },
  { value: "holesky", label: "Holesky 测试网", description: "大规模质押测试" },
];

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
  transactionFee: string;
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

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const [selectedNetwork, setSelectedNetwork] = useState(
    networkOptions[1].value
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");

  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [txHash, setTxHash] = useState("");
  const [transactionView, setTransactionView] = useState<TransactionPreview>(
    emptyTransactionPreview
  );

  const networkLabel = useMemo(
    () =>
      networkOptions.find((opt) => opt.value === selectedNetwork)?.label ??
      "未知网络",
    [selectedNetwork]
  );

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        new Error("未检测到 MetaMask 请先安装浏览器插件");
        return;
      }
      const account: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccountAddress(account[0]);
      const p = new BrowserProvider(window.ethereum);
      setProvider(p);
      const s = await p.getSigner();
      setSigner(s);
      const n = await p.getNetwork();
      setSelectedNetwork(n.name);
    } catch (e) {
      console.error(e);
    }
    console.log("[Wallet] Connect button clicked", {
      network: selectedNetwork,
    });
    setConnectionStatus("connected");
  };

  const handleDisconnect = () => {
    console.log("[Wallet] Disconnect button clicked");
    setConnectionStatus("disconnected");
  };

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    console.log("[Network] Network changed", { network: value });
  };

  const handleSyncAccount = async () => {
    try {
      const bal = await provider?.getBalance(accountAddress);
      setAccountBalance(formatEther(bal));
    } catch (error) {
      console.error(error);
    }
    console.log("[Account] Sync account clicked", {
      address: accountAddress,
      balance: accountBalance,
      network: selectedNetwork,
    });
  };

  const handleInspectTransaction = async () => {
    const trimmedHash = txHash.trim();
    if (!trimmedHash) {
      console.warn("[Transaction] Missing tx hash input");
      return;
    }
    const n = await provider?.getNetwork();
    console.log(
      "%c [ n ]: ",
      "color: #bf2c9f; background: pink; font-size: 13px;",
      n
    );
    if (!n) {
      console.error("没有连接钱包！");
      return;
    }
    const prov = new EtherscanProvider(
      n?.chainId,
      import.meta.env.VITE_ETHERSCAN_API_KEY
    );
    setTransactionView({
      ...emptyTransactionPreview,
      hash: trimmedHash,
      status: "pending",
      statusLabel: "等待链上响应",
    });
    const tx = await prov.getTransaction(trimmedHash);
    if (!tx) {
      console.error("网络错误！");
      return;
    }
    console.log(
      "%c [ tx ]: ",
      "color: #bf2c9f; background: pink; font-size: 13px;",
      tx
    );
    setTransactionView({
      ...emptyTransactionPreview,
      statusLabel: "完成",
      hash: tx!.hash ? tx!.hash : "",
      status: "success",
      blockNumber: tx!.blockNumber,
      confirmations: 0,
      from: tx!.from,
      to: tx!.to,
      value: tx!.value,
      gasPrice: tx!.gasPrice,
      gasLimit: tx!.gasLimit,
      nonce: tx!.nonce,
      transactionType: tx!.type,
      positionInBlock: tx!.index,
      inputData: tx!.data,
    });
  };

  const handleResetTransactionView = () => {
    setTxHash("");
    setTransactionView(emptyTransactionPreview);
    console.log("[Transaction] Placeholder state reset");
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">ethers.js 入门面板</p>
          <h1>钱包连接 + 网络切换 + 交易浏览骨架</h1>
          <p className="subtitle">
            这里只负责展示 UI 与交互流程，所有真实调用均用 console.log
            进行占位，方便后续无缝替换为 ethers.js 与 Etherscan 接口的真实逻辑。
          </p>
        </div>
        <div className="network-chip">
          <span>当前网络</span>
          <strong>{networkLabel}</strong>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>钱包状态</h2>
            <p>模拟连接流程，便于后续接入 MetaMask / WalletConnect</p>
          </div>
          <div className="status-indicator">
            <span
              className={
                connectionStatus === "connected" ? "dot online" : "dot offline"
              }
            />
            {connectionStatus === "connected" ? "已连接" : "未连接"}
          </div>
        </div>

        <div className="actions">
          <button type="button" onClick={handleConnectWallet}>
            连接钱包
          </button>
          <button
            type="button"
            className="secondary"
            onClick={handleDisconnect}
          >
            断开连接
          </button>
        </div>

        <label className="field">
          <span>选择网络</span>
          <select
            value={selectedNetwork}
            onChange={(event) => handleNetworkChange(event.target.value)}
          >
            {networkOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} · {option.description}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>账户信息</h2>
            <p>占位展示：地址、余额等基础数据</p>
          </div>
          <button type="button" className="ghost" onClick={handleSyncAccount}>
            输出当前信息
          </button>
        </div>

        <div className="grid">
          <label className="field">
            <span>地址 (0x...)</span>
            <input
              autoComplete="off"
              placeholder="0x1234..."
              value={accountAddress}
              onChange={(event) => setAccountAddress(event.target.value)}
            />
          </label>
          <label className="field">
            <span>余额 (ETH)</span>
            <input
              autoComplete="off"
              placeholder="0.00"
              value={accountBalance}
              onChange={(event) => setAccountBalance(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="panel transaction-panel">
        <div className="panel-header">
          <div>
            <h2>链上交易查询</h2>
            <p>模仿 Etherscan 交易详情页的布局，仅保留 UI 骨架与占位信息。</p>
          </div>
          <div className="transaction-actions">
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
      </section>
    </div>
  );
}

export default App;
