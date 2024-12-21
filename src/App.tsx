import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { WalletProvider } from "./contexts/WalletContext";
import { MarketplacePage } from "./pages/MarketplacePage";
import { Dashboard } from "./pages/Dashboard";
import { ChatPage } from "./pages/ChatPage";
import { AIModelsPage } from "./pages/AIModelsPage";
import { useRentals } from "./hooks/useRentals";
import { useToast } from "./hooks/useToast";
import { useWalletBalance } from "./hooks/useWalletBalance";
import { GPU } from "./types/gpu";
import { ProfilePage } from "./pages/ProfilePage";
import { ParticleBackground } from "./components/ui/ParticleBackground";
import { SettingsPage } from "./pages/SettingsPage";
import { useWallet } from "./hooks/useWallet";
import { PublicKey } from "@solana/web3.js";

type View = "marketplace" | "dashboard" | "chat" | "ai-models" | "settings";

function App() {
  const { publicKey, connected } = useWallet();
  const { balance } = useWalletBalance(publicKey || null);
  const { rentals, handleRent, getTotalSpent, handleExpire } = useRentals(
    publicKey || undefined
  );
  const { toasts, showToast, removeToast } = useToast();
  const [currentView, setCurrentView] = useState<View>("marketplace");

  const onRent = async (gpu: GPU, hours: number) => {
    if (!publicKey) {
      showToast("Please connect your wallet first!", "error");
      return;
    }

    try {
      const result = await handleRent(gpu, hours, publicKey);
      if (result.success) {
        showToast(
          `Successfully rented ${gpu.name} for ${hours} hours!`,
          "success"
        );
      } else {
        showToast("Transaction failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Rental transaction error:", error);
      showToast("Transaction failed. Please try again.", "error");
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
  };

  return (
    <WalletProvider>
      <MainLayout
        currentView={currentView}
        onChangeView={handleViewChange}
        toasts={toasts}
        onRemoveToast={removeToast}
      >
        <Routes>
          <Route
            path="/"
            element={
              <MarketplacePage
                onRent={onRent}
                balance={balance}
                walletAddress={publicKey?.toBase58()}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                rentals={rentals}
                totalSpent={getTotalSpent()}
                onExpire={handleExpire}
              />
            }
          />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/ai-models" element={<AIModelsPage />} />
          <Route path="/profile/:address" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
      <ParticleBackground />
    </WalletProvider>
  );
}

export default App;
