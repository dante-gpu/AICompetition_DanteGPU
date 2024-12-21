import React, { useState } from 'react';
import { AccountSettingsPanel } from '../components/profile/AccountSettings';
import { useWallet } from '../hooks/useWallet';
import { accountService } from '../services/account';
import { Settings, Shield, User, Bell } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const SettingsPage: React.FC = () => {
  const { publicKey } = useWallet();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSettingsUpdate = async (updates: any) => {
    if (!publicKey) {
      showToast('Please connect your wallet first!', 'error');
      return;
    }

    setLoading(true);
    try {
      await accountService.updateSettings(publicKey.toBase58(), updates);
      showToast('Settings updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast('Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-glow-400" />
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        </div>
        <p className="text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[
          { icon: User, label: 'Account' },
          { icon: Bell, label: 'Notifications' },
          { icon: Shield, label: 'Privacy & Security' }
        ].map((tab, index) => (
          <button
            key={index}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium min-w-max
              ${index === 0 
                ? 'bg-gradient-to-r from-glow-400 to-glow-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }
              transition-all duration-300
            `}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        {publicKey ? (
          <AccountSettingsPanel
            settings={{
              notifications: {
                email: true,
                rental: true,
                marketing: false
              },
              privacy: {
                showActivity: true,
                showStats: true,
                showRentals: true
              },
              preferences: {
                theme: 'dark',
                currency: 'SOL',
                language: 'en'
              }
            }}
            onUpdate={handleSettingsUpdate}
          />
        ) : (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Please connect your wallet</p>
            <p className="text-sm text-gray-500">
              You need to connect your wallet to access settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};