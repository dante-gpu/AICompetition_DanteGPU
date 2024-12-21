import React from 'react';
import { AccountSettings } from '../../services/account';
import { Switch } from '../ui/Switch';
import { 
  Bell, Eye, Globe, Moon, DollarSign, Mail, 
  MessageSquare, BellRing, Lock, UserCircle, Languages,
  CreditCard, Settings, Shield
} from 'lucide-react';

interface SettingsProps {
  settings: AccountSettings;
  onUpdate: (settings: Partial<AccountSettings>) => void;
}

export const AccountSettingsPanel: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'es', name: 'Español' }
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center gap-2 mb-6">
          <BellRing className="w-5 h-5 text-glow-400" />
          <h3 className="text-lg font-medium text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
          <Switch
            label="Email Notifications"
            description="Receive important updates via email"
            checked={settings.notifications.email}
            onChange={(checked) => onUpdate({
              notifications: { ...settings.notifications, email: checked }
            })}
            icon={Mail}
          />
          <Switch
            label="Rental Updates"
            description="Get notified about your GPU rentals"
            checked={settings.notifications.rental}
            onChange={(checked) => onUpdate({
              notifications: { ...settings.notifications, rental: checked }
            })}
            icon={Bell}
          />
          <Switch
            label="Marketing"
            description="Receive news and special offers"
            checked={settings.notifications.marketing}
            onChange={(checked) => onUpdate({
              notifications: { ...settings.notifications, marketing: checked }
            })}
            icon={MessageSquare}
          />
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-glow-400" />
          <h3 className="text-lg font-medium text-white">Privacy</h3>
        </div>
        <div className="space-y-4">
          <Switch
            label="Show Activity"
            description="Make your activity visible to others"
            checked={settings.privacy.showActivity}
            onChange={(checked) => onUpdate({
              privacy: { ...settings.privacy, showActivity: checked }
            })}
            icon={Eye}
          />
          <Switch
            label="Show Statistics"
            description="Display your rental statistics publicly"
            checked={settings.privacy.showStats}
            onChange={(checked) => onUpdate({
              privacy: { ...settings.privacy, showStats: checked }
            })}
            icon={Shield}
          />
          <Switch
            label="Show Rentals"
            description="Let others see your rental history"
            checked={settings.privacy.showRentals}
            onChange={(checked) => onUpdate({
              privacy: { ...settings.privacy, showRentals: checked }
            })}
            icon={UserCircle}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-glow-400" />
          <h3 className="text-lg font-medium text-white">Preferences</h3>
        </div>
        
        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
          <div className="flex gap-3">
            {['dark', 'light'].map((theme) => (
              <button
                key={theme}
                onClick={() => onUpdate({
                  preferences: { ...settings.preferences, theme: theme as 'dark' | 'light' }
                })}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border
                  ${settings.preferences.theme === theme 
                    ? 'bg-dark-600 border-glow-400 text-white' 
                    : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'
                  }
                `}
              >
                <Moon className="w-4 h-4" />
                <span className="capitalize">{theme}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
          <div className="flex gap-3">
            {['SOL', 'USD'].map((currency) => (
              <button
                key={currency}
                onClick={() => onUpdate({
                  preferences: { ...settings.preferences, currency: currency as 'SOL' | 'USD' }
                })}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border
                  ${settings.preferences.currency === currency 
                    ? 'bg-dark-600 border-glow-400 text-white' 
                    : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'
                  }
                `}
              >
                <DollarSign className="w-4 h-4" />
                <span>{currency}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onUpdate({
                  preferences: { ...settings.preferences, language: lang.code }
                })}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border
                  ${settings.preferences.language === lang.code 
                    ? 'bg-dark-600 border-glow-400 text-white' 
                    : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'
                  }
                `}
              >
                <Globe className="w-4 h-4" />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-dark-800/50 rounded-xl p-6 border border-red-500/20">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <button
            className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 
                       text-red-500 rounded-lg transition-colors"
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Handle account deletion
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}; 