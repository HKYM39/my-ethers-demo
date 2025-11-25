import { hardhat, sepolia } from "viem/chains";
import { createConfig, http, injected } from "wagmi";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [hardhat],
  connectors: [injected(), metaMask()],
  transports: {
    [hardhat.id]: http("http://localhost:8545"),
  },
});
