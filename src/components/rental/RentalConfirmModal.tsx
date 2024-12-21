import React from "react";
import { GPU } from "../../types/gpu";
import { Button } from "../ui/Button";
import { formatSOL } from "../../utils/format";

interface RentalConfirmModalProps {
  gpu: GPU;
  hours: number;
  totalPrice: number;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const RentalConfirmModal: React.FC<RentalConfirmModalProps> = ({
  gpu,
  hours,
  totalPrice,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold mb-4">Confirm GPU Rental</h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">GPU Model</span>
            <span className="font-medium">{gpu.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium">{hours} hours</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Price per Hour</span>
            <span className="font-medium">
              {formatSOL(gpu.pricePerHour)} SOL
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-900 font-semibold">Total Price</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700 font-bold">
                {formatSOL(totalPrice)} SOL
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onCancel} variant="secondary" fullWidth>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="primary" fullWidth>
            Confirm Rental
          </Button>
        </div>
      </div>
    </div>
  );
};
