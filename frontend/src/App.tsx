import "./App.css";
import Hero from "./components/Hero";
import TransactionPanel from "./components/TransactionPanel";
import TransferPanel from "./components/TransferPanel";
import WalletAccountPanel from "./components/WalletAccountPanel";

function App() {
  return (
    <div className="app">
      <Hero />
      <main className="dashboard-grid">
        <div className="sidebar-stack">
          <WalletAccountPanel />
          <TransferPanel />
        </div>
        <div className="main-column">
          <TransactionPanel />
        </div>
      </main>
    </div>
  );
}

export default App;
