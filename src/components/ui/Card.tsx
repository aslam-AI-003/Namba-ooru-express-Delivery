'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'outline';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  variant = 'glass',
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const variants = {
    glass: 'bg-dark-500/60 backdrop-blur-xl border border-dark-50/20',
    solid: 'bg-dark-500 border border-dark-50/10',
    outline: 'bg-transparent border border-dark-50/30',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl',
        variants[variant],
        paddings[padding],
        hover && 'card-hover cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
