import "./App.css";
import Hero from "./components/Hero";
import TransactionPanel from "./components/TransactionPanel";
import TransferPanel from "./components/TransferPanel";
import WalletAccountPanel from "./components/WalletAccountPanel";

function App() {
  return (
    <div className="app">
      <Hero />
      <WalletAccountPanel />
      <TransferPanel />
      <TransactionPanel />
    </div>
  );
}

export default App;
