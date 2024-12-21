import React, { useState } from "react";
import { GPUCard } from "../components/GPUCard";
import { GPU } from "../types/gpu";
import { CreateGPUModal } from "../components/gpu/CreateGPUModal";
import { Plus } from "lucide-react";
import { useGPUs } from "../hooks/useGPUs";
import { useToast } from "../hooks/useToast";

const ADMIN_WALLET = "CvNCt8Y3xpDANXKavGMQ1zfcZxMYrncyNgHXc5MBHFF7";

interface MarketplacePageProps {
  onRent: (gpu: GPU, hours: number) => Promise<void>;
  balance: number | null;
  walletAddress?: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onRent,
  balance,
  walletAddress,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGPU, setEditingGPU] = useState<GPU | null>(null);
  const { gpus, addGPU, deleteGPU, updateGPU, loading } = useGPUs();
  const { showToast } = useToast();
  const isAdmin = walletAddress === ADMIN_WALLET;

  const handleEdit = (gpu: GPU) => {
    setEditingGPU(gpu);
    setShowCreateModal(true);
  };

  const handleDelete = async (gpu: GPU) => {
    if (window.confirm(`Are you sure you want to delete ${gpu.name}?`)) {
      try {
        await deleteGPU(gpu);
        showToast("GPU deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting GPU:", error);
        showToast("Failed to delete GPU", "error");
      }
    }
  };

  const handleSubmit = async (gpuData: Omit<GPU, "id">) => {
    try {
      if (editingGPU) {
        await updateGPU(editingGPU.id, gpuData);
        showToast("GPU updated successfully", "success");
      } else {
        await addGPU(gpuData);
        showToast("GPU created successfully", "success");
      }
    } catch (error) {
      console.error("Error submitting GPU:", error);
      showToast("Operation failed", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">GPU Marketplace</h1>
          <p className="text-gray-400 mt-2">
            Rent high-performance GPUs for your AI and machine learning
            workloads
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-glow-400 to-glow-600 text-white hover:shadow-lg hover:shadow-glow-500/20 transition-all duration-300 hover:scale-105"
          >
            <Plus size={20} className="animate-pulse" />
            <span className="font-medium">Add New GPU</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glow-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gpus.map((gpu) => (
            <GPUCard
              key={gpu.id}
              gpu={gpu}
              onRent={onRent}
              disabled={!walletAddress}
              userBalance={balance}
              walletAddress={walletAddress}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateGPUModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingGPU(null);
        }}
        onSubmit={handleSubmit}
        creatorAddress={walletAddress || ""}
        initialData={editingGPU}
        mode={editingGPU ? "edit" : "create"}
      />
    </div>
  );
};
export { GPUCard };

