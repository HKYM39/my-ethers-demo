import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MessageStoreModule", (m) => {
  const store = m.contract("MessageStore");

  m.call(store, "storeMessage", ["Hello"]);

  return { store };
});
