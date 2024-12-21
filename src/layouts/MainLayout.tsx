import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Toast } from '../components/ui/Toast';
import { ToastData } from '../types/toast';
import { useWalletContext } from '../contexts/WalletContext';

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string) => void;
  toasts: ToastData[];
  onRemoveToast: (id: number) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentView,
  onChangeView,
  toasts,
  onRemoveToast
}) => {
  const { connected, walletAddress, onConnect, onDisconnect } = useWalletContext();

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar
        connected={connected}
        walletAddress={walletAddress}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        currentView={currentView}
        onChangeView={onChangeView}
      />
      <main className="pt-16">
        {children}
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemoveToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};