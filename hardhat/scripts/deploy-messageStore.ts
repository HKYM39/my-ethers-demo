import { network } from "hardhat";

const { viem, networkName } = await network.connect();
const clinet = await viem.getPublicClient();

console.log(`正在部署 MessageStore 到链${networkName}....`);

const message = await viem.deployContract("MessageStore");

console.log("合约地址：", message.address);

console.log("测试合约功能....");
const tx = await message.write.storeMessage(["abc"]);

console.log("等待调用交易哈希返回.....");
await clinet.waitForTransactionReceipt({ hash: tx, confirmations: 1 });

console.log("部署成功！");
