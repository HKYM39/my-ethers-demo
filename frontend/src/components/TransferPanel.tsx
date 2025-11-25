import { useState } from "react";
import "./TransferPanel.css";
import { useWriteContract } from "wagmi";
import abiJson from "../abi/MessageStore.json";

const ABI = abiJson.abi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const TransferPanel = () => {
  const [recordText, setRecordText] = useState("");
  const [hexPreview, setHexPreview] = useState("");
  const { writeContract, error, isPending, data: hash } = useWriteContract();

  const toHex = (value: string) =>
    Array.from(value)
      .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");

  const handleRecord = () => {
    const trimmed = recordText.trim();
    if (!trimmed) {
      console.warn("[Record] Empty input");
      return;
    }
    const hex = toHex(trimmed);
    writeContract(
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "storeMessage",
        args: [hex],
      },
      {
        onSuccess(txHash) {
          // 这里的 txHash 就是交易哈希
          setHexPreview(txHash);
        },
      }
    );
    // setHexPreview(`0x${hex}`);
    console.log("[Record] Hex payload", `0x${hex}`);
    console.log(hash);
  };

  const handleReset = () => {
    setRecordText("");
    setHexPreview("");
    console.log("[Record] Reset input");
  };

  return (
    <section className="panel transfer-panel">
      <div className="panel-header">
        <div>
          <h2>记录模块</h2>
          <p>输入任意内容，点击按钮将其转换为十六进制并输出到控制台。</p>
        </div>
        <div className="transfer-actions">
          <button type="button" className="ghost" onClick={handleReset}>
            清空
          </button>
          <button type="button" onClick={handleRecord}>
            记录并输出
          </button>
        </div>
      </div>

      <label className="field">
        <span>记录内容</span>
        <input
          autoComplete="off"
          placeholder="输入需要记录的文本..."
          value={recordText}
          onChange={(event) => setRecordText(event.target.value)}
        />
      </label>

      <div className="transfer-hint">
        <p>最新十六进制：{hexPreview || "--"}</p>
      </div>
    </section>
  );
};

export default TransferPanel;
