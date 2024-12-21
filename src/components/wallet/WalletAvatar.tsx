import React from 'react';

interface WalletAvatarProps {
  address: string;
  size?: number;
  className?: string;
}

export const WalletAvatar: React.FC<WalletAvatarProps> = ({
  address,
  size = 32,
  className = ''
}) => {
  // Robohash API'sini kullanarak cüzdan adresinden avatar oluştur
  const avatarUrl = `https://robohash.org/${address}?set=set4&size=${size}x${size}&bgset=bg1`;

  return (
    <img
      src={avatarUrl}
      alt="Wallet Avatar"
      width={size}
      height={size}
      className={`rounded-full ring-2 ring-purple-500/20 ${className}`}
    />
  );
};