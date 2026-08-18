import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const initial = (name || '?').trim().charAt(0).toUpperCase();
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (src && !imageError) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-[#D9E4EE] bg-[#EBF3FA] relative shadow-2xs ${className}`}
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback initial
  return (
    <div
      className={`${sizeClass} rounded-full shrink-0 bg-gradient-to-br from-[#164E7A] to-[#163A63] text-white font-bold flex items-center justify-center border border-[#D9E4EE] shadow-2xs ${className}`}
      title={name}
    >
      {initial}
    </div>
  );
};
