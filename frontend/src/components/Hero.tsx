import { useMemo, useState } from "react";
import "./Hero.css";

const networkOptions = [
  { value: "mainnet", label: "以太坊主网", description: "全网正式资产" },
  { value: "sepolia", label: "Sepolia 测试网", description: "官方测试网络" },
  { value: "holesky", label: "Holesky 测试网", description: "大规模质押测试" },
];

const Hero = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(
    networkOptions[1].value
  );
  const networkLabel = useMemo(
    () =>
      networkOptions.find((opt) => opt.value === selectedNetwork)?.label ??
      "未知网络",
    [selectedNetwork]
  );

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    console.log("[Hero] Network switched", { value });
  };

  return (
    <header className="hero">
      <div>
        <p className="eyebrow">ethers.js 入门面板</p>
        <h1>钱包连接 + 网络切换 + 交易浏览骨架</h1>
        <p className="subtitle">
          这里只负责展示 UI 与交互流程，所有真实调用均用 console.log
          进行占位，方便后续无缝替换为 ethers.js 与接口的真实逻辑。
        </p>
      </div>
      <div className="network-chip">
        <span>当前网络</span>
        <strong>{networkLabel}</strong>
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
      </div>
    </header>
  );
};

export default Hero;
