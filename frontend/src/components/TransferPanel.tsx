import { useState } from "react";
import "./TransferPanel.css";

const TransferPanel = () => {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("ETH");

  const handleSubmit = () => {
    console.log("[Transfer] Submit clicked", {
      from: fromAddress,
      to: toAddress,
      amount,
      tokenSymbol,
    });
  };

  const handleReset = () => {
    setFromAddress("");
    setToAddress("");
    setAmount("");
    setTokenSymbol("ETH");
    console.log("[Transfer] Reset form");
  };

  return (
    <section className="panel transfer-panel">
      <div className="panel-header">
        <div>
          <h2>转账操作</h2>
          <p>仅提供 UI 骨架，实际签名与广播逻辑请自行补充。</p>
        </div>
        <div className="transfer-actions">
          <button type="button" className="ghost" onClick={handleReset}>
            清空输入
          </button>
          <button type="button" onClick={handleSubmit}>
            发起转账
          </button>
        </div>
      </div>

      <div className="grid">
        <label className="field">
          <span>From 地址</span>
          <input
            autoComplete="off"
            placeholder="0x 发起地址"
            value={fromAddress}
            onChange={(event) => setFromAddress(event.target.value)}
          />
        </label>
        <label className="field">
          <span>To 地址</span>
          <input
            autoComplete="off"
            placeholder="0x 收款地址"
            value={toAddress}
            onChange={(event) => setToAddress(event.target.value)}
          />
        </label>
      </div>

      <div className="grid">
        <label className="field">
          <span>数量</span>
          <input
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label className="field">
          <span>代币符号</span>
          <input
            autoComplete="off"
            placeholder="ETH / USDC..."
            value={tokenSymbol}
            onChange={(event) => setTokenSymbol(event.target.value)}
          />
        </label>
      </div>
    </section>
  );
};

export default TransferPanel;
