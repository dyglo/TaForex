import React from 'react';

/**
 * Button atom with variant and size support, responsive to dark mode via Tailwind.
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-neutral-100 dark:bg-accent-light dark:text-neutral-900 hover:bg-accent-light',
  secondary: 'bg-neutral-800 text-neutral-100 dark:bg-neutral-700 dark:text-neutral-200 hover:bg-neutral-600',
  outline: 'border border-neutral-500 text-neutral-100 dark:border-neutral-300 dark:text-neutral-100 hover:bg-neutral-900 dark:hover:bg-neutral-800',
  accent: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const classes = [
    'rounded',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-accent',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
};

export default Button;
