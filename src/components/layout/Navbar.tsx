import React from 'react';
import { WalletButton } from '../wallet/WalletButton';
import { NavButton } from '../ui/NavButton';
import { Store, Brain, LayoutDashboard, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccountSearchBar } from '../search/AccountSearchBar';

const ADMIN_WALLET = "CvNCt8Y3xpDANXKavGMQ1zfcZxMYrncyNgHXc5MBHFF7";

interface NavbarProps {
  connected: boolean;
  connecting: boolean;
  walletAddress?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  connected,
  connecting,
  walletAddress,
  onConnect,
  onDisconnect,
  currentView,
  onChangeView,
}) => {
  const navigate = useNavigate();
  const isAdmin = walletAddress === ADMIN_WALLET;

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: Store, path: '/' },
    { id: 'ai-models', label: 'AI Models', icon: Brain, path: '/ai-models' },
    ...(isAdmin && connected ? [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
    ] : []),
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          <div
            onClick={() => navigate('/')}
            className="text-2xl font-bold gradient-text cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            Dgpu.fun
          </div>
          
          <div className="flex items-center justify-between flex-1 gap-8">
            <div className="flex items-center gap-2">
              {navItems.map(item => (
                <NavButton
                  key={item.id}
                  onClick={() => {
                    handleNavigation(item.path);
                    onChangeView(item.id);
                  }}
                  label={item.label}
                  icon={item.icon}
                  active={currentView === item.id}
                />
              ))}
            </div>

            <div className="flex-1 max-w-xl min-w-[300px]">
              <AccountSearchBar />
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <WalletButton
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              connected={connected}
              connecting={connecting}
              walletAddress={walletAddress}
            />
            
            <NavButton
              onClick={() => {
                navigate('/settings');
                onChangeView('settings');
              }}
              label="Settings"
              icon={Settings}
              active={currentView === 'settings'}
              className={`
                relative group overflow-hidden
                ${connected ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
              `}
              disabled={!connected}
            >
              {!connected && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark-800 text-white text-xs px-3 py-1.5 rounded-lg border border-dark-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                  Connect wallet to access settings
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-800 border-r border-b border-dark-700 rotate-45" />
                </div>
              )}
            </NavButton>
          </div>
        </div>
      </div>
    </nav>
  );
};