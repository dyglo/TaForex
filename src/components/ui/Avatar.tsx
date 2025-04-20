import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'User avatar', size = 80, className = '' }) => {
  // Use Tailwind arbitrary value classes for dynamic size
  const sizeClass = `w-[${size}px] h-[${size}px]`;
  return (
    <div
      className={`rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center border-2 border-neutral-900 dark:border-neutral-400 ${sizeClass} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <span className="text-neutral-300 text-2xl font-semibold">?</span>
      )}
    </div>
  );
};

export default Avatar;
