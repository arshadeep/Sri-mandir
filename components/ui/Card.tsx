import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200';

  const variantStyles = {
    default: 'bg-background shadow-md',
    elevated: 'bg-background shadow-lg hover:shadow-xl',
    outlined: 'bg-background border-2 border-primary border-opacity-20',
  };

  const interactiveStyles = onClick
    ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
