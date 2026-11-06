import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  roleColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const getPalette = (fullName: string) => {
    const palettes = [
      { bg: 'bg-[#F47736]', text: 'text-white' },
      { bg: 'bg-[#78917C]', text: 'text-white' },
      { bg: 'bg-[#211F1D]', text: 'text-[#F7F4EF]' },
      { bg: 'bg-[#C28559]', text: 'text-white' },
      { bg: 'bg-[#5B7360]', text: 'text-white' },
    ];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = (hash + fullName.charCodeAt(i)) % palettes.length;
    }
    return palettes[hash];
  };

  const palette = getPalette(name);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center font-heading font-bold select-none shrink-0 ${palette.bg} ${palette.text} ${className}`}
        title={name}
        aria-label={name}
      >
        <span>{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`object-cover shrink-0 ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};
