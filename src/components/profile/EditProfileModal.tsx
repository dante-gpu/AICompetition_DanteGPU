import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { UserProfile } from '../../types/user';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, User, FileText } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username || '',
    bio: profile.bio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-dark-800 rounded-xl w-full max-w-md transform border border-dark-700 transition-all">
          <div className="flex justify-between items-center p-6 border-b border-dark-700">
            <Dialog.Title className="text-xl font-bold gradient-text">
              Edit Profile
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              name="username"
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
              icon={<User className="text-glow-400" />}
            />

            <Input
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself"
              icon={<FileText className="text-glow-400" />}
              multiline
              className="h-24"
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 