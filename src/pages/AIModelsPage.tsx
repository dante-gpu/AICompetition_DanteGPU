import React from 'react';
import { AIModelCard } from '../components/ai/AIModelCard';
import { aiModels } from '../data/aiModels';
import { useWallet } from '../hooks/useWallet';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { useRentals } from '../hooks/useRentals';
import { useToast } from '../hooks/useToast';

export const AIModelsPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { balance } = useWalletBalance(publicKey);
  const { handleRent } = useRentals();
  const { showToast } = useToast();

  const onRent = async (modelId: string, hours: number) => {
    if (!publicKey) {
      showToast('Please connect your wallet first!', 'error');
      return;
    }

    const model = aiModels.find(m => m.id === modelId);
    if (!model) return;

    try {
      const result = await handleRent(model.gpu, hours, publicKey);
      if (result.success) {
        showToast(`Successfully rented ${model.name} for ${hours} hours!`, 'success');
      } else {
        showToast('Transaction failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Rental transaction error:', error);
      showToast('Transaction failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">
          AI Models
        </h1>
        <p className="text-gray-400 mt-2">
          Rent pre-trained AI models for your applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiModels.map((model) => (
          <AIModelCard
            key={model.id}
            model={model}
            onRent={(hours) => onRent(model.id, hours)}
            disabled={!connected}
            userBalance={balance}
          />
        ))}
      </div>
    </div>
  );
};