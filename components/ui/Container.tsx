import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centerContent?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  centerContent = false,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  const centerClasses = centerContent
    ? 'flex flex-col items-center justify-center min-h-screen'
    : '';

  return (
    <div className={`w-full mx-auto px-4 py-6 ${maxWidthClasses[maxWidth]} ${centerClasses} ${className}`}>
      {children}
    </div>
  );
};
