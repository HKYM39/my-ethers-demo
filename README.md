# my-ethers-demo

一套用 Hardhat 3 + The Graph + React / wagmi 打造的以太坊入门示例。核心流程：部署 `MessageStore` 合约、通过 subgraph 抓取 `MessageStored` 事件，再用前端面板调用与展示。

## 目录速览
- `hardhat/`：Hardhat 3 配置与合约 (`contracts/MessageBoard.sol`)、Ignition 部署模块 (`ignition/modules/MessageBoard.ts`)、基于 `node:test` 的示例测试。
- `subgraph/`：The Graph 子图，监听 `MessageStored` 事件并将 `sender/message/timestamp` 写入实体模型。
- `frontend/`：Vite + React + wagmi + React Query 面板，包含钱包连接、写入 `storeMessage`、查询子图消息列表。

## 前置环境
- Node.js 18+
- pnpm (推荐)；各子目录独立安装依赖。
- 如果要连测试网：Sepolia RPC（`SEPOLIA_RPC_URL`）与私钥（`SEPOLIA_PRIVATE_KEY`）。

## 开发与运行
### 1) 合约 (hardhat/)
```bash
cd hardhat
pnpm install
pnpm hardhat test                     # 运行 node:test 测试

# 部署 MessageStore（本地链）
pnpm hardhat ignition deploy ignition/modules/MessageBoard.ts

# 部署到 Sepolia（需环境变量）
SEPOLIA_RPC_URL=... SEPOLIA_PRIVATE_KEY=0x... \
pnpm hardhat ignition deploy --network sepolia ignition/modules/MessageBoard.ts
```
部署完成后记录合约地址，供 subgraph 与前端使用。

### 2) 子图 (subgraph/)
`subgraph/subgraph.yaml` 与 `networks.json` 默认指向 Sepolia 地址 `0x9E1A6deFD380A22D8b2E4C2511d640f5B661b337` / `startBlock: 9706775`，如部署了新合约请同步修改。
```bash
cd subgraph
pnpm install
pnpm codegen
pnpm build
pnpm deploy            # 默认推送到 Graph Studio（需提前 graph auth --studio <token>）
# 或本地节点：
# pnpm create-local && pnpm deploy-local
```

### 3) 前端 (frontend/)
创建 `.env.local`（或 `.env`）填入运行时变量：
```bash
VITE_CONTRACT_ADDRESS=0x...          # 部署的 MessageStore 地址
VITE_GRAPH_URL=https://api.studio.thegraph.com/query/<id>/<version>
VITE_GRAPH_API_KEY=<Graph Studio API Key>   # 如果使用 Studio 需 Bearer Token
```
然后启动：
```bash
cd frontend
pnpm install
pnpm dev
```
主要能力：
- 钱包连接：wagmi + injected/metamask，展示 ENS、余额（Sepolia）。
- 记录消息：调用 `storeMessage` 写链并在面板显示交易哈希。
- 消息查询：从子图拉取最新 `MessageStored` 列表并展示。

## 数据流提示
1. `storeMessage(string)` 发出 `MessageStored(sender, message, timestamp)` 事件。
2. 子图 `subgraph/src/message-store.ts` 监听事件并落库 `MessageStored` 实体。
3. 前端通过 GraphQL `messageStoreds` 查询最新消息，结合合约地址展示。

## 参考文件
- 合约：`hardhat/contracts/MessageBoard.sol`
- 部署模块：`hardhat/ignition/modules/MessageBoard.ts`
- 子图 schema：`subgraph/schema.graphql`
- 前端入口：`frontend/src/main.tsx`、`frontend/src/components/*`
