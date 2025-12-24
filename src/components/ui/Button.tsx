import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ls-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none tracking-wide',
          {
            'bg-ls-accent text-ls-dark hover:bg-cyan-400': variant === 'primary',
            'bg-white text-ls-dark hover:bg-gray-200': variant === 'secondary',
            'border-2 border-ls-accent text-ls-accent hover:bg-ls-accent hover:text-ls-dark': variant === 'outline',
            'hover:bg-ls-light/10 text-ls-light': variant === 'ghost',
            'h-9 p-4 text-sm': size === 'sm',
            'h-11 p-8 text-base': size === 'md',
            'h-14 p-10 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
