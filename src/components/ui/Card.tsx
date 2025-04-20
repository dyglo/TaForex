import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'glow';
  className?: string;
  /**
   * If true, applies a smooth glowing border for emphasis.
   */
  glow?: boolean;
}

const variantClasses: Record<string, string> = {
  default: 'bg-surface-card dark:bg-surface-cardDark text-neutral-900 dark:text-neutral-100 p-5 rounded-2xl shadow-2xl',
  outlined: 'bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 p-5 rounded-2xl shadow-2xl',
  glow: 'bg-surface-card dark:bg-surface-cardDark text-neutral-900 dark:text-neutral-100 p-5 rounded-2xl shadow-2xl ring-2 ring-blue-400/70 animate-glow',
};

// Add this to your global CSS or Tailwind config if not present:
// .animate-glow { box-shadow: 0 0 16px 4px rgba(56,189,248,0.5), 0 0 0 0 #000; transition: box-shadow 0.3s; }


const Card: React.FC<CardProps> = ({ variant = 'default', className = '', glow = false, children, ...props }) => {
  const classes = [variantClasses[glow ? 'glow' : variant], className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
