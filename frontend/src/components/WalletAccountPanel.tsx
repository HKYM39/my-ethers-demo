import { sepolia } from "viem/chains";
import "./WalletAccountPanel.css";
import {
  useBalance,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { formatUnits } from "viem";

const WalletAccountPanel = () => {
  const { connect, status } = useConnect();
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();
  const { address } = useConnection();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined });
  const { data: balance } = useBalance({
    address,
    query: { enabled: !!address },
    chainId: sepolia.id,
  });

  const isConnected = status === "success";
  const primaryConnector = connectors[0];

  const displayName =
    ensName ||
    (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "未连接");
  const displayBalance = balance
    ? `${formatUnits(balance.value, balance.decimals)} ${balance.symbol}`
    : isConnected
    ? "加载中..."
    : "--";

  const handleConnect = () => {
    if (!primaryConnector) {
      console.warn("[Wallet] No connector available");
      return;
    }
    connect({ connector: primaryConnector });
    console.log(balance);

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
          <span className={isConnected ? "dot online" : "dot offline"} />
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
            onClick={() => disconnect()}
          >
            断开连接
          </button>
        </div>
      </div>

      <div className="account-card">
        <div className="avatar-wrapper">
          {ensAvatar ? (
            <img src={ensAvatar} alt="ENS Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-fallback">{displayName[0] || "?"}</div>
          )}
        </div>
        <div className="account-text">
          <div className="account-name">{displayName}</div>
          <div className="account-address">
            {ensName && address
              ? `${ensName} · ${address}`
              : address || "等待连接..."}
          </div>
        </div>
        <div className="account-balance">
          <span>Balance</span>
          <strong>{displayBalance}</strong>
        </div>
      </div>
    </section>
  );
};

export default WalletAccountPanel;
