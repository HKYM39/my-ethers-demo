import { useState } from "react";
import "./WalletAccountPanel.css";
import { useConnect, useConnection, useConnectors, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

const WalletAccountPanel = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnect"
  >("connected");
  const { connect, status } = useConnect();
  const connector = useConnectors()[0];
  const { disconnect } = useDisconnect();
  const { address } = useConnection();
  const {data: ensName} = useEnsName({address});
  const {data: ensAvatar} = useEnsAvatar({name: ensName!});
  const [accountBalance, setAccountBalance] = useState("");
  const handleConnect = () => {
    connect({ connector });
    console.log("[Wallet] Connect wallet");
  };

  return (
    <section className="panel wallet-account-panel">
      <div className="panel-header">
        <div>
          <h2>钱包与账户</h2>
          <p>钱包连接、基础账户信息展示与同步入口。</p>
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

      <div className="wallet-account-actions">
        <div className="actions">
          <button type="button" onClick={handleConnect}>
            连接钱包
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              disconnect();
            }}
          >
            断开连接
          </button>
        </div>
      </div>

      <div className="grid">
        <label className="field">
          <span>地址 (0x...)</span>
          <input
            autoComplete="off"
            placeholder="0x1234..."
            value={address ? "": (address && <div>{ensName ? `${ensName} (${address})` : address}</div>)}
            readOnly
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
  );
};

export default WalletAccountPanel;
