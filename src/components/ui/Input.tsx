import React from 'react';

/**
 * Input atom with variant and size support, responsive to dark mode via Tailwind.
 */

type InputVariant = 'filled' | 'outline';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
}

const variantClasses: Record<InputVariant, string> = {
  filled: 'bg-neutral-800 dark:bg-neutral-600 text-neutral-100 placeholder-neutral-400 border border-transparent focus:border-accent focus:ring-2 focus:ring-accent',
  outline: 'bg-transparent border border-neutral-600 dark:border-neutral-500 text-neutral-100 placeholder-neutral-400 focus:border-accent focus:ring-2 focus:ring-accent',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const Input: React.FC<InputProps> = ({
  variant = 'outline',
  inputSize = 'md',
  className = '',
  label,
  ...props
}) => {
  const classes = [
    'rounded',
    'focus:outline-none',
    'focus:ring-offset-2',
    variantClasses[variant],
    sizeClasses[inputSize],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return label ? (
    <label className="block w-full">
      <span className="block mb-1 text-neutral-300 text-sm">{label}</span>
      <input className={classes} {...props} />
    </label>
  ) : (
    <input className={classes} {...props} />
  );
};

export default Input;
